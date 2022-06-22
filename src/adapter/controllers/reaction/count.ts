import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CountReactionsUseCase } from "src/declarations/usecases/reaction/count/usecase";

@Throttle(1, 0.1)
@Controller("reactions/count")
export class CountReactionsController extends AbstractController {
  constructor(private readonly usecase: CountReactionsUseCase) {
    super();
  }

  @Get()
  async receive(
    @BearerToken() accessToken: string,
    @Query("room_id") roomId: string,
    @Query("user_id") userId: string,
  ) {
    if (typeof roomId !== "string") {
      throw new BadRequestException();
    }

    if (typeof userId !== "string") {
      throw new BadRequestException();
    }

    const result = await this.usecase.execute({
      accessToken,
      roomId,
      userId,
    });

    return this.response(result);
  }
}
