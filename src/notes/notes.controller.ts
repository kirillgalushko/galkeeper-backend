import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { Note } from './note.entity';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  create(@Request() req: any): Promise<Note> {
    return this.notesService.create(req.body, req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Get('bulk')
  bulk(@Request() req: any): Promise<Note[]> {
    return this.notesService.findAllByOwner(req.user.sub);
  }

  // TODO:
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(id);
  }
}
