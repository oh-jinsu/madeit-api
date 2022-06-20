import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { RoomResult } from "src/domain/results/room";
import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class FindMyRoomsUsecase extends AuthorizedUseCase<
  Params,
  RoomResult[]
> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
  ): Promise<UseCaseResult<RoomResult[]>> {
    const participants = await this.participantRepository.find({
      where: {
        userId,
      },
    });

    const rooms = await Promise.all(
      participants.map(async ({ roomId }) => {
        const { id, title, createdAt } = await this.roomRepository.findOne({
          where: {
            id: roomId,
          },
        });

        const participantCount = await this.participantRepository.count({
          where: {
            roomId,
          },
        });

        return {
          id,
          title,
          participantCount,
          createdAt,
        };
      }),
    );

    return new UseCaseOk(rooms);
  }
}
