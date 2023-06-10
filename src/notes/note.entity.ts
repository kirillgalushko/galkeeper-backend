import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ nullable: true })
  public name?: string;

  @Column({ nullable: true })
  public login?: string;

  @Column({ nullable: true })
  public password?: string;

  @ManyToOne(() => User, (user) => user.notes)
  owner: User;
}
