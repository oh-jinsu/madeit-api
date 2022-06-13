import { Controller, Get } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { FindMyRoomsUsecase } from "src/domain/usecases/room/find_mine/usecase";

@Throttle(1, 0.1)
@Controller("rooms/mine")
export class FindMyRoomsController extends AbstractController {
  constructor(private readonly usecase: FindMyRoomsUsecase) {
    super();
  }

  @Get()
  async receive(@BearerToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }
}
