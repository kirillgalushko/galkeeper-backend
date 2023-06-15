import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';
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
    note.updatedAt = new Date();
    note.isDeleted = false;

    const saved = await this.notesRepository.save(note);
    return saved;
  }

  async set(noteDto: Note, ownerId: number): Promise<any> {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }

    if (noteDto.id) {
      const oldNote = await this.get(noteDto.id);
      if (
        oldNote &&
        new Date(noteDto.updatedAt) > new Date(oldNote.updatedAt)
      ) {
        await this.notesRepository.update(noteDto.id, {
          ...noteDto,
          updatedAt: new Date(),
        });
        return this.get(noteDto.id);
      }
      return;
    }

    return this.create(noteDto, ownerId);
  }

  async findAllByOwner(ownerId: number): Promise<Note[]> {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }
    return this.notesRepository.findBy({ owner, isDeleted: false });
  }

  get(id: number): Promise<Note | null> {
    return this.notesRepository.findOneBy({ id: id });
  }

  async getAllSinceLastUpdate(ownerId: number, updatedAt: Date) {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }
    return this.notesRepository.findBy({
      owner,
      updatedAt: MoreThanOrEqual(updatedAt),
      isDeleted: false,
    });
  }

  async getAllDeleted(ownerId: number, updatedAt: Date) {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }
    return this.notesRepository.findBy({
      owner,
      updatedAt: MoreThanOrEqual(updatedAt),
      isDeleted: true,
    });
  }

  async delete(noteId: number, ownerId: number): Promise<number | null> {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) {
      throw new UnauthorizedException();
    }
    const oldNote = await this.get(noteId);
    if (!oldNote) {
      return null;
    }

    oldNote.isDeleted = true;
    oldNote.updatedAt = new Date();
    await this.notesRepository.update(noteId, oldNote);
    return noteId;
  }
}
