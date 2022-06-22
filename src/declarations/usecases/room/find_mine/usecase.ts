import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { Repository } from "typeorm";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { UserEntity } from "src/declarations/entities/user";
import { MyRoomModel } from "src/declarations/models/room/mine";
import { ChatEntity } from "src/declarations/entities/chat";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class FindMyRoomsUsecase extends AuthorizedUseCase<
  Params,
  MyRoomModel[]
> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
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
  ): Promise<UseCaseResult<MyRoomModel[]>> {
    const participants = await this.participantRepository.find({
      where: {
        userId,
      },
    });

    const rooms = await Promise.all(
      participants.map(async ({ roomId }) => {
        const {
          id,
          title,
          description,
          ownerId,
          goalLabel,
          goalSymbol,
          maxParticipant,
          createdAt,
        } = await this.roomRepository.findOne({
          where: {
            id: roomId,
          },
        });

        const [
          participantCount,
          owner,
          performances,
          myPerformances,
          lastChatEntity,
        ] = await Promise.all([
          this.participantRepository.count({
            where: {
              roomId: id,
            },
          }),
          this.userRepository.findOne({
            where: {
              id: ownerId,
            },
          }),
          this.performanceRepository.find({
            where: {
              roomId: id,
            },
          }),
          this.performanceRepository.find({
            where: {
              roomId: id,
              userId,
            },
          }),
          this.chatRepository.findOne({
            where: {
              roomId,
            },
            order: {
              createdAt: "DESC",
            },
          }),
        ]);

        const performanceValue =
          performances.length === 0
            ? -1
            : performances.reduce((prev, curr) => prev + curr.value, 0) /
              performances.length;

        const myPerformanceValue =
          myPerformances.length === 0
            ? -1
            : myPerformances.reduce((prev, curr) => prev + curr.value, 0) /
              myPerformances.length;

        const lastChat = await (async () => {
          if (!lastChatEntity) {
            return null;
          }

          const common = {
            id: lastChatEntity.id,
            roomId: lastChatEntity.roomId,
            createdAt: lastChatEntity.createdAt,
          };

          switch (lastChatEntity.type) {
            case "notice": {
              const { message } = await this.chatMessageRepository.findOne({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              return {
                type: lastChatEntity.type,
                message,
                ...common,
              };
            }
            case "message": {
              const { message } = await this.chatMessageRepository.findOne({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              const userEntity = await this.userRepository.findOne({
                where: {
                  id: lastChatEntity.userId,
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
                type: lastChatEntity.type,
                message,
                user,
                ...common,
              };
            }
            case "image": {
              const chatImages = await this.chatImageRepository.find({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              const imageIds = chatImages.map(({ imageId }) => imageId);

              const userEntity = await this.userRepository.findOne({
                where: {
                  id: lastChatEntity.userId,
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
                type: lastChatEntity.type,
                imageIds,
                user,
                ...common,
              };
            }
            case "photolog": {
              const { message } = await this.chatMessageRepository.findOne({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              const chatImages = await this.chatImageRepository.find({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              const imageIds = chatImages.map(({ imageId }) => imageId);

              const { isChecked } = await this.chatPhotologRepository.findOne({
                where: {
                  chatId: lastChatEntity.id,
                },
              });

              const userEntity = await this.userRepository.findOne({
                where: {
                  id: lastChatEntity.userId,
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
                type: lastChatEntity.type,

                message,
                imageIds,
                isChecked,
                user,
                ...common,
              };
            }
          }
        })();

        return {
          id,
          title,
          description,
          owner: {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            avatarId: owner.avatarId,
            updatedAt: owner.updatedAt,
            createdAt: owner.createdAt,
          },
          performance: {
            label: goalLabel,
            value: performanceValue,
            symbol: goalSymbol,
          },
          myPerformance: {
            label: goalLabel,
            value: myPerformanceValue,
            symbol: goalSymbol,
          },
          lastChat,
          participantCount,
          maxParticipant,
          createdAt,
        };
      }),
    );

    return new UseCaseOk(rooms);
  }
}
