import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../auth/constants';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

const getUserIdFromClient = async (client: Socket, jwtService: JwtService) => {
  const token = client.handshake.auth.token;
  if (!token) {
    throw new UnauthorizedException();
  }

  const payload = await jwtService.verifyAsync(token, {
    secret: jwtConstants.secret,
  });
  return payload.sub;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/transmitter',
  transports: ['websocket'],
})
export class TransmitterGateway {
  @WebSocketServer()
  server: Server;
  wsClients: Map<number, Socket[]> = new Map();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const userId = await getUserIdFromClient(client, this.jwtService);
      const userClients = this.wsClients.get(userId);
      this.wsClients.set(userId, [...(userClients || []), client]);
    } catch (e) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // TODO: Remove from map
    console.log('Disconnect', client.id);
  }

  @SubscribeMessage('request-sync')
  onSubscribe(@ConnectedSocket() client: Socket) {
    // Add map of events
    this.broadcastExcept('request-sync', client);
  }

  private async broadcastExcept(event: string, client: Socket) {
    const userId = await getUserIdFromClient(client, this.jwtService);
    const userClients = this.wsClients.get(userId);
    const clients = userClients?.filter((c) => c.id != client.id) || [];
    for (const client of clients) {
      client.emit(event);
    }
  }
}
