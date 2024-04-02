import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { IUser } from './interfaces/user.interface';
import { BookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private usersRepository: Repository<Book>,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    user: IUser,
  ): Promise<BookDto> {
    const book = { ownerUsername: user.username, ...createBookDto };
    const createdBook = await this.usersRepository.save(book);

    return createdBook;
  }
}
