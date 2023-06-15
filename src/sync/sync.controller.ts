import { Controller, Post, Req } from '@nestjs/common';
import { SyncDto } from './dto/sync.dto';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  create(@Req() req: any): Promise<SyncDto> {
    return this.syncService.sync(req.body, req.user.sub);
  }
}
