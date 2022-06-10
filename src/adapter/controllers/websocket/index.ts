import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { VerifyAuthUseCase } from "src/domain/usecases/auth/verify/usecase";

@WebSocketGateway()
export class WebSocketController implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly verifyAuthUseCase: VerifyAuthUseCase) {}

  async handleConnection(client: Socket) {
    const accessToken = client.handshake.url
      .split("&")
      .find((query) => query.includes("token="))
      ?.replace("token=", "");

    if (!accessToken) {
      return client.disconnect();
    }

    const result = await this.verifyAuthUseCase.execute({ accessToken });

    if (!result.isOk()) {
      return client.disconnect();
    }
  }

  @SubscribeMessage("echo")
  async receive(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.emit("echo", data);
  }
}
