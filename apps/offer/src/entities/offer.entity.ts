import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookSlug: string;

  @Column()
  username: string;

  @Column()
  amount: number;
}
