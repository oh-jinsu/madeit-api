import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { ChatEntity } from "src/declarations/entities/chat";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { ComeOnReactionEntity } from "src/declarations/entities/reactions/come_on";
import { GoodReactionEntity } from "src/declarations/entities/reactions/good";
import { LoveReactionEntity } from "src/declarations/entities/reactions/love";
import { AuthProvider } from "src/declarations/providers/auth";
import { In, Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
  readonly userId: string;
  readonly roomId: string;
};

export type Model = {
  readonly goodCount: number;
  readonly loveCount: number;
  readonly comeOnCount: number;
};

@Injectable()
export class CountReactionsUseCase extends AuthorizedUseCase<Params, Model> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(GoodReactionEntity)
    private readonly goodReactionRepository: Repository<GoodReactionEntity>,
    @InjectRepository(LoveReactionEntity)
    private readonly loveReactionRepository: Repository<LoveReactionEntity>,
    @InjectRepository(ComeOnReactionEntity)
    private readonly comeOnReactionRepository: Repository<ComeOnReactionEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
    { userId, roomId }: Params,
  ): Promise<UseCaseResult<Model>> {
    const me = await this.participantRepository.findOne({
      where: {
        userId: id,
        roomId,
      },
    });

    if (!me) {
      return new UseCaseException(1);
    }

    const other = await this.participantRepository.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!other) {
      return new UseCaseException(2);
    }

    const photologs = await this.chatRepository.find({
      where: {
        roomId,
        userId,
        type: "photolog",
      },
    });

    const ids = photologs.map(({ id }) => id);

    const [goodCount, loveCount, comeOnCount] = await Promise.all([
      this.goodReactionRepository.count({
        where: {
          id: In(ids),
        },
      }),
      this.loveReactionRepository.count({
        where: {
          id: In(ids),
        },
      }),
      this.comeOnReactionRepository.count({
        where: {
          roomId,
          receiver: userId,
        },
      }),
    ]);

    return new UseCaseOk({
      goodCount,
      loveCount,
      comeOnCount,
    });
  }
}
