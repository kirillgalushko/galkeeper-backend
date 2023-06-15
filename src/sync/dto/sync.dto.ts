import { Note } from 'src/notes/note.entity';

export interface SyncDto {
  syncedAt: Date;
  deleted: {
    notes: Array<number>;
  };
  updated: {
    notes: Array<Note>;
  };
}
