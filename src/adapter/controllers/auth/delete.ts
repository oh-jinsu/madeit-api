import { Controller, Delete, HttpCode } from "@nestjs/common";
import { AbstractController } from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { DeleteAuthUseCase } from "src/domain/usecases/auth/delete/usecase";

@Controller("auth")
export class DeleteAuthController extends AbstractController {
  constructor(private readonly usecase: DeleteAuthUseCase) {
    super();
  }

  @Delete()
  @HttpCode(204)
  async receive(@BearerToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }
}
