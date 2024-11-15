import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ type: 'longtext', nullable: true })
  public name?: string;

  @Column({ type: 'longtext', nullable: true })
  public login?: string;

  @Column({ type: 'longtext', nullable: true })
  public password?: string;

  @Column({ type: 'timestamp' })
  public updatedAt: Date;

  @Column()
  public isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.notes)
  owner: User;
}
