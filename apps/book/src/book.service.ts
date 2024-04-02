import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { IUser } from './interfaces/user.interface';
import { BookDto } from './dto/book.dto';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async getBook(slug: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ slug });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async createBook(bookDto: BookDto, user: IUser): Promise<Book> {
    const urlId = nanoid();
    const slug = urlId + '-' + slugify(bookDto.name);
    console.log(slug);
    const book = { ownerUsername: user.username, slug, ...bookDto };

    const createdBook = await this.bookRepository.save(book);

    return createdBook;
  }
}
