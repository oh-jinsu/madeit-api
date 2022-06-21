import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { BroadcastOperator, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { VerifyAuthUseCase } from "src/declarations/usecases/auth/verify/usecase";
import { FindMyRoomsUsecase } from "src/declarations/usecases/room/find_mine/usecase";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private readonly sockets: Record<string, Socket>;

  constructor(
    private readonly verifyAuthUseCase: VerifyAuthUseCase,
    private readonly findMyRoomsUseCase: FindMyRoomsUsecase,
  ) {
    this.sockets = {};
  }

  async handleConnection(client: Socket) {
    const accessToken = client.handshake.query["token"] as string;

    if (!accessToken) {
      return client.disconnect();
    }

    const authorization = await this.verifyAuthUseCase.execute({ accessToken });

    if (!authorization.isOk()) {
      return client.disconnect();
    }

    this.sockets[authorization.value.id] = client;

    const rooms = await this.findMyRoomsUseCase.execute({ accessToken });

    if (!rooms.isOk()) {
      return client.disconnect();
    }

    await client.join(rooms.value.map(({ id }) => id));

    client.emit("connected-with-auth", {});
  }

  handleDisconnect(client: Socket) {
    const key = Object.keys(this.sockets).find(
      (socket) => this.sockets[socket] === client,
    );

    delete this.sockets[key];
  }

  getSocket(id: string): Socket {
    return this.sockets[id];
  }

  getRoom(id: string | string[]): BroadcastOperator<DefaultEventsMap, any> {
    return this.server.to(id);
  }
}
