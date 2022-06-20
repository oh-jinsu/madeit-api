import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { ChatEntity } from "src/declarations/entities/chat";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { UserEntity } from "src/declarations/entities/user";
import { ChatModel } from "src/declarations/models/chat";
import { AuthProvider } from "src/declarations/providers/auth";
import { UuidProvider } from "src/declarations/providers/uuid";
import { Repository } from "typeorm";

export type MessageTypeParams = {
  readonly type: "message";
  readonly message: string;
};

export type ImageTypeParams = {
  readonly type: "image";
  readonly imageIds: string[];
};

export type PhotologTypeParams = {
  readonly type: "photolog";
  readonly message: string;
  readonly imageIds: string[];
};

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
} & (MessageTypeParams | ImageTypeParams | PhotologTypeParams);

@Injectable()
export class CreateChatUseCase extends AuthorizedUseCase<Params, ChatModel> {
  constructor(
    authProvider: AuthProvider,
    private readonly uuidProvider: UuidProvider,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>,
    @InjectRepository(ChatImageEntity)
    private readonly chatImageRepository: Repository<ChatImageEntity>,
    @InjectRepository(ChatPhotologEntity)
    private readonly chatPhotologRepository: Repository<ChatPhotologEntity>,
  ) {
    super(authProvider);
  }
  protected async executeWithAuth(
    userId: string,
    { roomId, ...params }: Params,
  ): Promise<UseCaseResult<ChatModel>> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new UseCaseException(1);
    }

    const participant = await this.participantRepository.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!participant) {
      return new UseCaseException(2);
    }

    switch (params.type) {
      case "message": {
        const { message, type } = params;

        const newChat = this.chatRepository.create({
          id: this.uuidProvider.generate(),
          userId,
          roomId,
          type,
        });

        const { id: chatId, createdAt } = await this.chatRepository.save(
          newChat,
        );

        const newChatMessage = this.chatMessageRepository.create({
          chatId,
          message,
        });

        await this.chatMessageRepository.save(newChatMessage);

        return new UseCaseOk({
          id: chatId,
          roomId,
          user,
          type,
          message,
          createdAt,
        });
      }
      case "image": {
        const { imageIds, type } = params;

        if (imageIds.length === 0) {
          return new UseCaseException(3);
        }

        const newChat = this.chatRepository.create({
          id: this.uuidProvider.generate(),
          userId,
          roomId,
          type,
        });

        const { id: chatId, createdAt } = await this.chatRepository.save(
          newChat,
        );

        await Promise.all(
          imageIds.map(async (imageId) => {
            const newone = this.chatImageRepository.create({
              id: this.uuidProvider.generate(),
              chatId,
              imageId,
            });

            const result = await this.chatImageRepository.save(newone);

            return result.imageId;
          }),
        );

        return new UseCaseOk({
          id: chatId,
          roomId,
          user,
          type,
          imageIds,
          createdAt,
        });
      }
      case "photolog": {
        const { message, imageIds, type } = params;

        if (imageIds.length === 0) {
          return new UseCaseException(3);
        }

        const newChat = this.chatRepository.create({
          id: this.uuidProvider.generate(),
          userId,
          roomId,
          type,
        });

        const { id: chatId, createdAt } = await this.chatRepository.save(
          newChat,
        );

        const newChatMessage = this.chatMessageRepository.create({
          chatId,
          message,
        });

        await this.chatMessageRepository.save(newChatMessage);

        await Promise.all(
          imageIds.map(async (imageId) => {
            const newone = this.chatImageRepository.create({
              id: this.uuidProvider.generate(),
              chatId,
              imageId,
            });

            const result = await this.chatImageRepository.save(newone);

            return result.imageId;
          }),
        );

        const newChatPhotolog = this.chatPhotologRepository.create({
          chatId,
          isChecked: false,
        });

        const { isChecked } = await this.chatPhotologRepository.save(
          newChatPhotolog,
        );

        return new UseCaseOk({
          id: chatId,
          roomId,
          user,
          type,
          message,
          imageIds,
          isChecked,
          createdAt,
        });
      }
      default:
        return new UseCaseException(4);
    }
  }
}
