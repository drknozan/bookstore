import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

describe('BookService', () => {
  let bookService: BookService;

  const mockBookRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
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

    jest.spyOn(mockBookRepository, 'save').mockResolvedValue(mockBook);

    const createdBook = await bookService.createBook(
      {
        name: mockBook.name,
        description: mockBook.description,
        year: mockBook.year,
        author: mockBook.author,
        numberOfPages: mockBook.numberOfPages,
        language: mockBook.language,
        price: mockBook.price,
      },
      { username: 'testuser' },
    );

    expect(mockBookRepository.save).toHaveBeenCalled();
    expect(createdBook).toEqual(mockBook);
  });
});
