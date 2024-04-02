import { Book } from '../entities/book.entity';

export const bookMapper = (book: Book) => ({
  slug: book.slug,
  name: book.name,
  description: book.description,
  year: book.year,
  author: book.author,
  numberOfPages: book.numberOfPages,
  language: book.language,
  price: book.price,
  ownerUsername: book.ownerUsername,
});
