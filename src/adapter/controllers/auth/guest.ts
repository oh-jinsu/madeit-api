import { Controller, Get } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { IssueGuestTokenUseCase } from "src/domain/usecases/auth/guest/usecase";

@Throttle(1, 1)
@Controller("auth/guest")
export class IssueGuestTokenController extends AbstractController {
  constructor(private readonly usecase: IssueGuestTokenUseCase) {
    super();
  }

  @Get()
  async receive() {
    const result = await this.usecase.execute();

    return this.response(result);
  }
}
