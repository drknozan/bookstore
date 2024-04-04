import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { IUser } from './interfaces/user.interface';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { bookMapper } from './mappers/book.mapper';
import { BookDto } from './dto/book.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SearchBookDto } from './dto/search-book.dto';
import Redis from 'ioredis';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    user: IUser,
  ): Promise<BookDto> {
    const urlId = nanoid();
    const slug = urlId + '-' + slugify(createBookDto.name);

    const book = { ownerUsername: user.username, slug, ...createBookDto };

    const createdBook = await this.bookRepository.save(book);

    const result = await lastValueFrom(
      this.searchClient.send(
        { cmd: 'insert_es' },
        { index: 'book', id: createdBook.id, data: bookMapper(createdBook) },
      ),
    );

    if (result !== 'created') {
      throw new InternalServerErrorException('Something went wrong');
    }

    return bookMapper(createdBook);
  }

  async getBook(slug: string): Promise<BookDto> {
    const cacheKey = `book:${slug}`;
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const bookBySlug = await this.bookRepository.findOneBy({ slug });

    if (!bookBySlug) {
      throw new NotFoundException('Book not found');
    }

    const book = bookMapper(bookBySlug);

    await this.redisClient.set(cacheKey, JSON.stringify(book));

    return book;
  }

  async searchBook(searchBookDto: SearchBookDto): Promise<BookDto[]> {
    const { query } = searchBookDto;
    const page = Number(searchBookDto.page || 1);
    const limit = Number(searchBookDto.limit || 10);

    if (!query) {
      return [];
    }

    const fields = ['name', 'description', 'year', 'author', 'language'];

    const books = await lastValueFrom(
      this.searchClient.send(
        { cmd: 'search_es' },
        { index: 'book', query, fields, page, limit },
      ),
    );

    return books;
  }

  async updateBook(
    slug: string,
    updateBookDto: UpdateBookDto,
    user: IUser,
  ): Promise<BookDto> {
    const bookBySlug = await this.getBook(slug);

    if (bookBySlug.ownerUsername !== user.username) {
      throw new UnauthorizedException('User is not owner of the book');
    }

    let newSlug = bookBySlug.slug;

    if (updateBookDto.name && bookBySlug.name !== updateBookDto.name) {
      const urlId = nanoid();
      newSlug = urlId + '-' + slugify(updateBookDto.name);
    }

    await this.bookRepository.update(
      { slug: bookBySlug.slug },
      { slug: newSlug, ...updateBookDto },
    );

    const updatedBook = await this.bookRepository.findOneBy({
      slug: newSlug,
    });

    const cacheKey = `book:${updatedBook.slug}`;
    await this.redisClient.del(cacheKey);

    const result = await lastValueFrom(
      this.searchClient.send(
        { cmd: 'update_es' },
        { index: 'book', id: updatedBook.id, data: bookMapper(updatedBook) },
      ),
    );

    if (result !== 'updated') {
      throw new InternalServerErrorException('Something went wrong');
    }

    return bookMapper(updatedBook);
  }

  async deleteBook(slug: string, user: IUser): Promise<{ message: string }> {
    const book = await this.bookRepository.findOneBy({ slug });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.ownerUsername !== user.username) {
      throw new UnauthorizedException('User is not owner of the book');
    }

    await this.bookRepository.delete({ slug: book.slug });

    const cacheKey = `book:${book.slug}`;
    await this.redisClient.del(cacheKey);

    const result = await lastValueFrom(
      this.searchClient.send(
        { cmd: 'delete_es' },
        { index: 'book', id: book.id },
      ),
    );

    if (result !== 'deleted') {
      throw new InternalServerErrorException('Something went wrong');
    }

    return { message: 'Book deleted' };
  }

  async checkBookOwnership({
    slug,
    username,
  }: {
    slug: string;
    username: string;
  }) {
    const book = await this.bookRepository.findOneBy({ slug });

    if (!book) {
      throw new RpcException({ code: 404, message: 'Book not found' });
    }

    if (book.ownerUsername !== username) {
      throw new RpcException({
        code: 401,
        message: 'User is not owner of the book',
      });
    }

    return true;
  }
}
