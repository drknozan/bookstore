import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { BookDto } from './dto/book.dto';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
}
