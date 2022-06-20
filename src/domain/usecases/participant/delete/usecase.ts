import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { ParticipantEntity } from "src/domain/entities/participant";
import { Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
};

export type Result = {
  readonly userId: string;
};

@Injectable()
export class DeleteParticipantUseCase extends AuthorizedUseCase<
  Params,
  Result
> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
    { roomId }: Params,
  ): Promise<UseCaseResult<Result>> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!participant) {
      return new UseCaseException(1);
    }

    await this.participantRepository.delete(participant.id);

    return new UseCaseOk({
      userId,
    });
  }
}
