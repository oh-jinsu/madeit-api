import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { VerifyAuthUseCase } from "src/domain/usecases/auth/verify/usecase";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  readonly server: Server;

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
}
