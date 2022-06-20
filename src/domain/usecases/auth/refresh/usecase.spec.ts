import { AuthEntity } from "src/domain/entities/auth";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockRepository } from "src/infrastructure/repositories/mock";
import { RefreshAuthUseCase } from "./usecase";

describe("Try to refresh", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyRefreshToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id" });

  const hashProvider = new MockHashProvider();

  hashProvider.compare.mockResolvedValue(true);

  const authRepository = new MockRepository<AuthEntity>();

  authRepository.findOne.mockResolvedValue({
    id: "an id",
    key: "a key",
    from: "somewhere",
    accessToken: "an access token",
    refreshToken: "a refresh token",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  const usecase = new RefreshAuthUseCase(
    authProvider,
    hashProvider,
    authRepository,
  );

  it("should fail for an invalid refresh token", async () => {
    authProvider.verifyRefreshToken.mockResolvedValueOnce(false);

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an absent user", async () => {
    authRepository.findOne.mockResolvedValueOnce(null);

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should fail for a discarded refresh token", async () => {
    hashProvider.compare.mockResolvedValueOnce(false);

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);
  });

  it("should return the new one", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    authProvider.issueAccessToken.mockResolvedValue("a new access token");

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBe("a new access token");
  });

  it("should return the old one", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(true);

    authProvider.issueAccessToken.mockResolvedValue("a new access token");

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBe("an access token");
  });
});
