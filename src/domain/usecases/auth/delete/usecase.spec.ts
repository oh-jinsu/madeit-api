import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { DeleteAuthUseCase } from "./usecase";

describe("Try to delete the auth", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id" });

  const authRepository = new MockAuthRepository();

  authRepository.delete.mockResolvedValue(null);

  const userRepository = new MockUserRepository();

  userRepository.delete.mockResolvedValue(null);

  const usecase = new DeleteAuthUseCase(
    authProvider,
    authRepository,
    userRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should be ok", async () => {
    const result = await usecase.execute({ accessToken: "an access token" });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });
});
