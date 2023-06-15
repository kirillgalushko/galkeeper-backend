import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SyncModule } from './sync/sync.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NotesModule,
    SyncModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '0.0.0.0',
      port: 44,
      username: 'root',
      password: 'root',
      database: 'db',
      entities: [],
      autoLoadEntities: true,
      // TODO: Replace it to false: https://docs.nestjs.com/techniques/database
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
