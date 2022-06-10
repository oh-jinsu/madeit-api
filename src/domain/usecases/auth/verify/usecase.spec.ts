import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { VerifyAuthUseCase } from "./usecase";

describe("Try to verify the authorization", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  const usecase = new VerifyAuthUseCase(authProvider);

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
