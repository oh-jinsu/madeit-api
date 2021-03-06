import { Global, Module } from "@nestjs/common";
import { DeleteAuthUseCase } from "src/declarations/usecases/auth/delete/usecase";
import { RefreshAuthUseCase } from "src/declarations/usecases/auth/refresh/usecase";
import { SignOutUseCase } from "src/declarations/usecases/auth/sign_out/usecase";
import { VerifyAuthUseCase } from "src/declarations/usecases/auth/verify/usecase";
import { UploadImageUseCase } from "src/declarations/usecases/image/upload/usecase";
import { CreateParticipantUseCase } from "src/declarations/usecases/participant/create/usecase";
import { DeleteParticipantUseCase } from "src/declarations/usecases/participant/delete/usecase";
import { CreateRoomUseCase } from "src/declarations/usecases/room/create/usecase";
import { FindRoomsUseCase } from "src/declarations/usecases/room/find/usecase";
import { FindMyRoomsUsecase } from "src/declarations/usecases/room/find_mine/usecase";
import { SignInUseCase } from "src/declarations/usecases/auth/sign_in/usecase";
import { SignUpUseCase } from "src/declarations/usecases/auth/sign_up/usecase";
import { FindMeUseCase } from "src/declarations/usecases/user/find_me/usecase";
import { UpdateMeUseCase } from "src/declarations/usecases/user/update_me/usecase";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "src/declarations/entities/auth";
import { UserEntity } from "src/declarations/entities/user";
import { ImageEntity } from "src/declarations/entities/image";
import { RoomEntity } from "src/declarations/entities/room";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
import { ChatEntity } from "src/declarations/entities/chat";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { CreateChatUseCase } from "src/declarations/usecases/chat/create/usecase";
import { FindChatsUseCase } from "src/declarations/usecases/chat/find/usecase";
import { CreateNoticeChatUseCase } from "src/declarations/usecases/chat/create_notice/usecase";
import { GoodReactionEntity } from "src/declarations/entities/reactions/good";
import { LoveReactionEntity } from "src/declarations/entities/reactions/love";
import { ComeOnReactionEntity } from "src/declarations/entities/reactions/come_on";
import { CountMyReactionsUseCase } from "src/declarations/usecases/reaction/count_mine/usecase";
import { CountReactionsUseCase } from "src/declarations/usecases/reaction/count/usecase";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      UserEntity,
      ImageEntity,
      RoomEntity,
      ParticipantEntity,
      PerformanceEntity,
      ChatEntity,
      ChatMessageEntity,
      ChatImageEntity,
      ChatPhotologEntity,
      GoodReactionEntity,
      LoveReactionEntity,
      ComeOnReactionEntity,
    ]),
  ],
  providers: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    RefreshAuthUseCase,
    SignInUseCase,
    SignUpUseCase,
    SignOutUseCase,
    // Auth Module
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
    FindMyRoomsUsecase,
    CreateRoomUseCase,
    // Room Module
    CreateParticipantUseCase,
    DeleteParticipantUseCase,
    // Participant Module
    FindChatsUseCase,
    CreateChatUseCase,
    CreateNoticeChatUseCase,
    // Chat Module
    CountReactionsUseCase,
    CountMyReactionsUseCase,
    // Reaction Module
    UploadImageUseCase,
    // Image Module
  ],
  exports: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    RefreshAuthUseCase,
    SignInUseCase,
    SignUpUseCase,
    SignOutUseCase,
    // Auth Module
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
    FindMyRoomsUsecase,
    CreateRoomUseCase,
    // Room Module
    CreateParticipantUseCase,
    DeleteParticipantUseCase,
    // Participant Module
    FindChatsUseCase,
    CreateChatUseCase,
    CreateNoticeChatUseCase,
    // Chat Module
    CountReactionsUseCase,
    CountMyReactionsUseCase,
    // Reaction Module
    UploadImageUseCase,
    // Image Module
  ],
})
export class UseCaseModule {}
