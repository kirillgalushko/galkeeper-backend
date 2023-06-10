import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { UsersModule } from '../users/users.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, User]), UsersModule],
  exports: [NotesService],
  providers: [
    NotesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [NotesController],
})
export class NotesModule {}
