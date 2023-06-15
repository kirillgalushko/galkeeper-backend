import { Injectable } from '@nestjs/common';
import { SyncDto } from './dto/sync.dto';
import { NotesService } from 'src/notes/notes.service';

@Injectable()
export class SyncService {
  constructor(private notesService: NotesService) {}

  async sync(data: SyncDto, ownerId: number): Promise<any> {
    const lastSyncedAt = data.syncedAt ? new Date(data.syncedAt) : null;

    const updatedNotes = await Promise.all(
      data.updated.notes.map(async (note) => {
        const saved = await this.notesService.set(note, ownerId);
        // @ts-expect-error TODO:
        return saved ? { ...saved, localId: note.localId } : null;
      }),
    );
    const deletedNotes = await Promise.all(
      data.deleted.notes.map((noteId) =>
        this.notesService.delete(noteId, ownerId),
      ),
    );

    let updatedEntitiesSinceLastSync = lastSyncedAt
      ? await this.notesService.getAllSinceLastUpdate(ownerId, lastSyncedAt)
      : await this.notesService.findAllByOwner(ownerId);
    // TODO: Duplication of entities in response
    updatedEntitiesSinceLastSync = updatedEntitiesSinceLastSync.filter(
      (e) => !updatedNotes.some((u) => u && u.id === e.id),
    );

    let deletedEntitiesSinceLastSync = lastSyncedAt
      ? await this.notesService.getAllDeleted(ownerId, lastSyncedAt)
      : [];
    deletedEntitiesSinceLastSync = deletedEntitiesSinceLastSync.filter(
      (e) => !deletedNotes.some((id) => id && id === e.id),
    );

    return {
      syncedAt: new Date(),
      updated: {
        notes: [...updatedNotes, ...updatedEntitiesSinceLastSync].filter(
          (e) => e,
        ),
      },
      deleted: {
        notes: [
          ...Array.from(new Set(deletedNotes)),
          ...deletedEntitiesSinceLastSync.map((e) => e.id),
        ].filter((e) => e),
      },
    };
  }
}
