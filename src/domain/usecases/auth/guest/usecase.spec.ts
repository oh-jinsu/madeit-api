import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { IssueGuestTokenUseCase } from "./usecase";

describe("Try to issue guest tokens", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("an access token");

  authProvider.issueRefreshToken.mockResolvedValue("an refresh token");

  const authRepository = new MockAuthRepository();

  authRepository.save.mockImplementation(async ({ key, from }) => ({
    id: "an id",
    key,
    from,
    accessToken: null,
    refreshToken: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  }));

  authRepository.update.mockImplementation(
    async (id, { key, from, accessToken, refreshToken }) => ({
      id,
      key: key ?? "a key",
      from: from ?? "somewhere",
      accessToken: accessToken ?? "an access token",
      refreshToken: refreshToken ?? "a refresh token",
      updatedAt: new Date(),
      createdAt: new Date(),
    }),
  );

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockResolvedValue("a hashed value");

  const usecase = new IssueGuestTokenUseCase(
    authProvider,
    hashProvider,
    authRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should be ok", async () => {
    const result = await usecase.execute();

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
