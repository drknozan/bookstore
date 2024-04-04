import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Param,
  Get,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookDto } from './dto/book.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SearchBookDto } from './dto/search-book.dto';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/books/search')
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async searchBook(@Query() searchBookDto: SearchBookDto): Promise<BookDto[]> {
    const books = await this.bookService.searchBook(searchBookDto);

    return books;
  }

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
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  @ApiResponse({ status: 201, description: 'CREATED' })
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
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
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

  @UseGuards(AuthGuard)
  @Delete('/books/delete/:slug')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async deleteBook(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<{ message: string }> {
    const { user } = req.user;
    const message = await this.bookService.deleteBook(slug, user);

    return message;
  }

  @MessagePattern({ cmd: 'check_book_owner' })
  async checkBookOwner(
    @Ctx() context: RmqContext,
    @Payload() payload: { slug: string; username: string },
  ) {
    const { slug, username } = payload;

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const isOwner = await this.bookService.checkBookOwnership({
      slug,
      username,
    });

    return isOwner;
  }
}
