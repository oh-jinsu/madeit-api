import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { FindRoomsUseCase } from "src/declarations/usecases/room/find/usecase";

@Throttle(1, 0.1)
@Controller("rooms")
export class FindRoomsController extends AbstractController {
  constructor(private readonly usecase: FindRoomsUseCase) {
    super();
  }

  @Get()
  async receive(
    @Query("cursor") cursor: string,
    @Query("limit") limitString: string,
  ) {
    if (cursor && typeof cursor !== "string") {
      throw new BadRequestException();
    }

    const limit = Number(limitString);

    if (limitString && Number.isNaN(limit)) {
      throw new BadRequestException();
    }

    const result = await this.usecase.execute({
      cursor,
      limit,
    });

    return this.response(result);
  }
}
