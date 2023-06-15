import { Module } from '@nestjs/common';
import { TransmitterGateway } from './transmitter.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [TransmitterGateway],
})
export class TransmitterModule {}
