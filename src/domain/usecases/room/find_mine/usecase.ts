import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { RoomRepository } from "src/domain/repositories/room";
import { RoomResult } from "src/domain/results/room";

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
    private readonly participantRepository: ParticipantRepository,
    private readonly roomRepository: RoomRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id: userId,
  }: ClaimModel): Promise<UseCaseResult<RoomResult[]>> {
    const participants = await this.participantRepository.findByUserId(userId);

    const rooms = await Promise.all(
      participants
        .map(async ({ roomId }) => {
          const option = await this.roomRepository.findOne(roomId);

          if (!option.isSome()) {
            return null;
          }

          const { id, title, createdAt } = option.value;

          const participantCount =
            await this.participantRepository.countByRoomId(roomId);

          return {
            id,
            title,
            participantCount,
            createdAt,
          };
        })
        .filter((e) => e),
    );

    return new UseCaseOk(rooms);
  }
}
