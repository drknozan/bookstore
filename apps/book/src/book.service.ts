import {
  Injectable,
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

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    user: IUser,
  ): Promise<BookDto> {
    const urlId = nanoid();
    const slug = urlId + '-' + slugify(createBookDto.name);

    const book = { ownerUsername: user.username, slug, ...createBookDto };

    const createdBook = await this.bookRepository.save(book);

    return bookMapper(createdBook);
  }

  async getBook(slug: string): Promise<BookDto> {
    const book = await this.bookRepository.findOneBy({ slug });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return bookMapper(book);
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

    return bookMapper(updatedBook);
  }

  async deleteBook(slug: string, user: IUser): Promise<{ message: string }> {
    const bookBySlug = await this.getBook(slug);

    if (bookBySlug.ownerUsername !== user.username) {
      throw new UnauthorizedException('User is not owner of the book');
    }

    await this.bookRepository.delete({ slug });

    return { message: 'Book deleted' };
  }
}
