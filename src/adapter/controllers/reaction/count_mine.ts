import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CountMyReactionsUseCase } from "src/declarations/usecases/reaction/count_mine/usecase";

@Throttle(1, 0.1)
@Controller("reactions/mine/count")
export class CountMyReactionsController extends AbstractController {
  constructor(private readonly usecase: CountMyReactionsUseCase) {
    super();
  }
  @Get()
  async receive(
    @BearerToken() accessToken: string,
    @Query("room_id") roomId?: string,
  ) {
    if (roomId && typeof roomId !== "string") {
      throw new BadRequestException();
    }

    const result = await this.usecase.execute({
      accessToken,
      roomId,
    });

    return this.response(result);
  }
}
