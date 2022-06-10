import { Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { FindRoomsUseCase } from "src/domain/usecases/room/find/usecase";

@Throttle(1, 0.1)
@Controller("rooms")
export class FindRoomsController extends AbstractController {
  constructor(private readonly usecase: FindRoomsUseCase) {
    super();
  }

  @Get()
  async receive(
    @Query("cursor") cursor: string,
    @Query("limit") limit: string,
  ) {
    const result = await this.usecase.execute({
      cursor,
      limit: Number(limit),
    });

    return this.response(result);
  }
}
