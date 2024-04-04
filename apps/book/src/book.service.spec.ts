import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('BookService', () => {
  let bookService: BookService;

  const mockBookRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSearchServiceClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
        {
          provide: 'SEARCH_SERVICE',
          useValue: mockSearchServiceClient,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  it('should create new book', async () => {
    const mockBook = {
      id: '1',
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: '2015',
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

    delete mockBook.id;

    expect(mockBookRepository.save).toHaveBeenCalled();
    expect(createdBook).toEqual(mockBook);
  });

  it('should get book by id', async () => {
    const mockBook = {
      id: '1',
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: '2015',
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest.spyOn(mockBookRepository, 'findOneBy').mockResolvedValue(mockBook);

    const book = await bookService.getBook(mockBook.slug);

    delete mockBook.id;

    expect(mockBookRepository.findOneBy).toHaveBeenCalled();
    expect(book).toEqual(mockBook);
  });

  it('should throw error if book not found', async () => {
    const mockBook = {
      id: '1',
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: '2015',
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest.spyOn(mockBookRepository, 'findOneBy').mockResolvedValue(false);

    delete mockBook.id;

    expect(mockBookRepository.findOneBy).toHaveBeenCalled();
    await expect(bookService.getBook(mockBook.slug)).rejects.toThrow(
      new NotFoundException('Book not found'),
    );
  });

  it('should delete book by slug', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: '2015',
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser',
    };

    jest.spyOn(mockBookRepository, 'findOneBy').mockResolvedValue(mockBook);

    const message = await bookService.deleteBook(mockBook.slug, {
      username: 'testuser',
    });

    expect(mockBookRepository.delete).toHaveBeenCalled();
    expect(message).toEqual({
      message: 'Book deleted',
    });
  });

  it('should throws error if user is not owner of the book when deleting book', async () => {
    const mockBook = {
      slug: 'lTwkejX-l_iAV096c0CLK-book-name',
      name: 'book-name',
      description: 'book-description',
      year: '2015',
      author: 'book-author',
      numberOfPages: 500,
      language: 'english',
      price: 35,
      ownerUsername: 'testuser1',
    };

    jest.spyOn(mockBookRepository, 'findOneBy').mockResolvedValue(mockBook);

    await expect(
      bookService.deleteBook(mockBook.slug, {
        username: 'testuser',
      }),
    ).rejects.toThrow(
      new UnauthorizedException('User is not owner of the book'),
    );
  });
});
