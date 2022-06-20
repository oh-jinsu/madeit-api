import { AuthEntity } from "src/declarations/entities/auth";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { DeleteAuthUseCase } from "./usecase";

describe("Try to delete the auth", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

  const authRepository = new MockRepository<AuthEntity>();

  authRepository.delete.mockResolvedValue(null);

  const userRepository = new MockRepository<UserEntity>();

  userRepository.delete.mockResolvedValue(null);

  const usecase = new DeleteAuthUseCase(
    authProvider,
    authRepository,
    userRepository,
  );

  it("should be ok", async () => {
    const result = await usecase.execute({ accessToken: "an access token" });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });
});
