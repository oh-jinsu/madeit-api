import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import { ListOf } from "src/declarations/common/types";
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
import { LessThan, Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
  readonly cursor?: string;
  readonly limit?: number;
};

@Injectable()
export class FindChatsUseCase extends AuthorizedUseCase<
  Params,
  ListOf<ChatModel>
> {
  constructor(
    authProvider: AuthProvider,
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
    { roomId, cursor, limit }: Params,
  ): Promise<UseCaseResult<ListOf<ChatModel, string>>> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!participant) {
      return new UseCaseException(1);
    }

    const cursored = cursor
      ? await this.chatRepository.findOne({
          where: {
            id: cursor,
          },
        })
      : null;

    const chats = await this.chatRepository.find({
      where: {
        roomId,
        createdAt: LessThan(cursored?.createdAt || new Date()),
      },
      order: {
        createdAt: "DESC",
      },
      take: limit ? limit + (cursored ? 0 : 1) : null,
    });

    if (cursored) {
      chats.unshift(cursored);
    }

    const next = limit && chats.length === limit + 1 ? chats.pop() : null;

    const items = await Promise.all(
      chats.map(async ({ id: chatId, roomId, userId, type, createdAt }) => {
        const common = {
          id: chatId,
          roomId,
          createdAt,
        };

        switch (type) {
          case "notice": {
            const { message } = await this.chatMessageRepository.findOne({
              where: {
                chatId,
              },
            });

            return {
              type,
              message,
              ...common,
            };
          }
          case "message": {
            const { message } = await this.chatMessageRepository.findOne({
              where: {
                chatId,
              },
            });

            const userEntity = await this.userRepository.findOne({
              where: {
                id: userId,
              },
            });

            const user = {
              id: userEntity.id,
              name: userEntity.name,
              email: userEntity.email,
              avatarId: userEntity.avatarId,
              updatedAt: userEntity.updatedAt,
              createdAt: userEntity.createdAt,
            };

            return {
              type,
              message,
              user,
              ...common,
            };
          }
          case "image": {
            const chatImages = await this.chatImageRepository.find({
              where: {
                chatId,
              },
            });

            const imageIds = chatImages.map(({ imageId }) => imageId);

            const userEntity = await this.userRepository.findOne({
              where: {
                id: userId,
              },
            });

            const user = {
              id: userEntity.id,
              name: userEntity.name,
              email: userEntity.email,
              avatarId: userEntity.avatarId,
              updatedAt: userEntity.updatedAt,
              createdAt: userEntity.createdAt,
            };

            return {
              type,
              imageIds,
              user,
              ...common,
            };
          }
          case "photolog": {
            const { message } = await this.chatMessageRepository.findOne({
              where: {
                chatId,
              },
            });

            const chatImages = await this.chatImageRepository.find({
              where: {
                chatId,
              },
            });

            const imageIds = chatImages.map(({ imageId }) => imageId);

            const { isChecked } = await this.chatPhotologRepository.findOne({
              where: {
                chatId,
              },
            });

            const userEntity = await this.userRepository.findOne({
              where: {
                id: userId,
              },
            });

            const user = {
              id: userEntity.id,
              name: userEntity.name,
              email: userEntity.email,
              avatarId: userEntity.avatarId,
              updatedAt: userEntity.updatedAt,
              createdAt: userEntity.createdAt,
            };

            return {
              type,
              message,
              imageIds,
              isChecked,
              user,
              ...common,
            };
          }
        }
      }),
    );

    return new UseCaseOk({
      next: next?.id,
      items,
    });
  }
}
