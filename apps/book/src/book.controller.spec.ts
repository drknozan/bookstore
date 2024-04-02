import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './guards/auth.guard';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let bookController: BookController;

  const mockBookService = {
    createBook: jest.fn(),
    getBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  const mockAuthServiceClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: BookService, useValue: mockBookService },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: mockAuthServiceClient,
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(bookController).toBeDefined();
  });

  it('should create new book', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: 2015,
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest.spyOn(mockBookService, 'createBook').mockResolvedValue(mockBook);

    const createdBook = await bookController.createBook(
      {
        name: mockBook.name,
        description: mockBook.description,
        year: mockBook.year,
        author: mockBook.author,
        numberOfPages: mockBook.numberOfPages,
        language: mockBook.language,
        price: mockBook.price,
      },
      { user: { username: 'testuser' } },
    );

    expect(mockBookService.createBook).toHaveBeenCalled();
    expect(createdBook).toEqual(mockBook);
  });

  it('should get book by slug', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: 2015,
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest.spyOn(mockBookService, 'getBook').mockResolvedValue(mockBook);

    const book = await bookController.getBook(mockBook.slug);

    expect(mockBookService.getBook).toHaveBeenCalled();
    expect(book).toEqual(mockBook);
  });

  it('should update book by slug', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: 2015,
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    const mockBookToUpdate = {
      name: 'book-new-name',
      description: 'book-new-description',
      year: 2017,
      author: 'book-new-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
    };

    jest.spyOn(mockBookService, 'updateBook').mockResolvedValue({
      slug: mockBook.slug,
      ...mockBookToUpdate,
    });

    const book = await bookController.updateBook(
      mockBook.slug,
      mockBookToUpdate,
      { user: { username: 'testuser' } },
    );

    expect(mockBookService.updateBook).toHaveBeenCalled();
    expect(book).toEqual({
      slug: mockBook.slug,
      ...mockBookToUpdate,
    });
  });

  it('should delete book by slug', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: 2015,
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest
      .spyOn(mockBookService, 'deleteBook')
      .mockResolvedValue({ message: 'Book deleted' });

    const message = await bookController.deleteBook(mockBook.slug, {
      user: { username: 'testuser' },
    });

    expect(mockBookService.deleteBook).toHaveBeenCalled();
    expect(message).toEqual({
      message: 'Book deleted',
    });
  });
});
