import { Module } from "@nestjs/common";
import { DeleteAuthController } from "src/adapter/controllers/auth/delete";
import { RefreshAuthController } from "src/adapter/controllers/auth/refresh";
import { SignInController } from "src/adapter/controllers/auth/sign_in";
import { SignOutController } from "src/adapter/controllers/auth/sign_out";
import { SignUpController } from "src/adapter/controllers/auth/sign_up";
import { UploadImageController } from "src/adapter/controllers/image/upload";
import { CreateParticipantController } from "src/adapter/controllers/participant/create";
import { DeleteParticipantController } from "src/adapter/controllers/participant/delete";
import { CreateRoomController } from "src/adapter/controllers/room/create";
import { FindRoomsController } from "src/adapter/controllers/room/find";
import { CreateMeController } from "src/adapter/controllers/user/create_me";
import { FindMeController } from "src/adapter/controllers/user/find_me";
import { UpdateMeController } from "src/adapter/controllers/user/update";
import { SocketGateway } from "src/adapter/gateways/socket";

@Module({
  providers: [SocketGateway],
  controllers: [
    DeleteAuthController,
    RefreshAuthController,
    SignInController,
    SignUpController,
    SignOutController,
    // Auth Module
    CreateMeController,
    FindMeController,
    UpdateMeController,
    // User Module
    FindRoomsController,
    CreateRoomController,
    // Room Module
    CreateParticipantController,
    DeleteParticipantController,
    // Participant Module
    UploadImageController,
    // Image Module
  ],
})
export class ControllerModule {}
