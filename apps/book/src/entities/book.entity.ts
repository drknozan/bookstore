import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  year: number;

  @Column()
  author: string;

  @Column()
  numberOfPages: number;

  @Column()
  language: string;

  @Column()
  price: number;

  @Column()
  ownerUsername: string;
}