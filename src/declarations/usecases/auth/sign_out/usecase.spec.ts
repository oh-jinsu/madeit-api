import { AuthEntity } from "src/declarations/entities/auth";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { SignOutUseCase } from "./usecase";

describe("Try to sign out", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

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

  const usecase = new SignOutUseCase(authProvider, authRepository);

  it("should fail for an invalid token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an invalid token", async () => {
    authRepository.findOne.mockResolvedValueOnce(null);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for a conflict", async () => {
    authRepository.findOne.mockResolvedValueOnce({
      id: "an id",
      key: "a key",
      from: "somewhere",
      accessToken: null,
      refreshToken: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
