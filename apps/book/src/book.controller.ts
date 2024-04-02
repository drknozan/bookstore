import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { BookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/books/:slug')
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async getBook(@Param('slug') slug: string): Promise<Book> {
    const book = await this.bookService.getBook(slug);

    return book;
  }

  @UseGuards(AuthGuard)
  @Post('/books/create')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async createBook(@Body() bookDto: BookDto, @Request() req): Promise<Book> {
    const { user } = req.user;
    const createdBook = await this.bookService.createBook(bookDto, user);

    return createdBook;
  }
}
