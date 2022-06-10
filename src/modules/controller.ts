import { Module } from "@nestjs/common";
import { DeleteAuthController } from "src/adapter/controllers/auth/delete";
import { IssueGuestTokenController } from "src/adapter/controllers/auth/guest";
import { RefreshAuthController } from "src/adapter/controllers/auth/refresh";
import { SignInController } from "src/adapter/controllers/auth/sign_in";
import { SignOutController } from "src/adapter/controllers/auth/sign_out";
import { SignUpController } from "src/adapter/controllers/auth/sign_up";
import { UploadImageController } from "src/adapter/controllers/image/upload";
import { CreateGuestController } from "src/adapter/controllers/user/create_guest";
import { CreateMeController } from "src/adapter/controllers/user/create_me";
import { FindMeController } from "src/adapter/controllers/user/find_me";
import { UpdateMeController } from "src/adapter/controllers/user/update";
import { WebSocketController } from "src/adapter/controllers/websocket";

@Module({
  providers: [WebSocketController],
  controllers: [
    DeleteAuthController,
    IssueGuestTokenController,
    RefreshAuthController,
    SignInController,
    SignUpController,
    SignOutController,
    // Auth Module
    CreateGuestController,
    CreateMeController,
    FindMeController,
    UpdateMeController,
    // User Module
    UploadImageController,
    // Image Module
  ],
})
export class ControllerModule {}
