import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookDto } from './dto/book.dto';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/books/:slug')
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async getBook(@Param('slug') slug: string): Promise<BookDto> {
    const book = await this.bookService.getBook(slug);

    return book;
  }

  @UseGuards(AuthGuard)
  @Post('/books/create')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @Request() req,
  ): Promise<BookDto> {
    const { user } = req.user;
    const createdBook = await this.bookService.createBook(createBookDto, user);

    return createdBook;
  }

  @UseGuards(AuthGuard)
  @Put('/books/update/:slug')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async updateBook(
    @Param('slug') slug: string,
    @Body() updateBookDto: UpdateBookDto,
    @Request() req,
  ): Promise<BookDto> {
    const { user } = req.user;
    const updatedBook = await this.bookService.updateBook(
      slug,
      updateBookDto,
      user,
    );

    return updatedBook;
  }
}
