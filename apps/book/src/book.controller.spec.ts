import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './guards/auth.guard';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let bookController: BookController;

  const mockBookService = {
    createBook: jest.fn(),
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
      id: 1,
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
});
