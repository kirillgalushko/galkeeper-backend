import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async create(createNoteDto: CreateNoteDto, ownerId: number): Promise<Note> {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }

    const note = new Note();
    note.name = createNoteDto.name;
    note.login = createNoteDto.login;
    note.password = createNoteDto.password;
    note.owner = owner;
    return this.notesRepository.save(note);
  }

  async findAllByOwner(ownerId: number): Promise<Note[]> {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }
    return this.notesRepository.findBy({ owner });
  }

  findOne(id: number): Promise<Note | null> {
    return this.notesRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.notesRepository.delete(id);
  }
}
