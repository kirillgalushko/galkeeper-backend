import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Note } from '../notes/note.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  // TODO: Add validation
  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public firstName?: string;

  @Column({ nullable: true })
  public lastName?: string;

  @Column()
  public password: string;

  @OneToMany(() => Note, (note) => note.owner)
  notes: Note[];
}
