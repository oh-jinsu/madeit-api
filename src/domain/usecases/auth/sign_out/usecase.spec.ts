import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { SignOutUseCase } from "./usecase";

describe("test a sign out usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id" });

  const authRepository = new MockAuthRepository();

  authRepository.findOne.mockImplementation(
    async (id: string) =>
      new Some({
        id,
        key: "a key",
        from: "somewhere",
        accessToken: "an access token",
        refreshToken: "a refresh token",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

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
    authRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for a conflict", async () => {
    authRepository.findOne.mockImplementationOnce(
      async (id: string) =>
        new Some({
          id,
          key: "a key",
          from: "somewhere",
          accessToken: null,
          refreshToken: null,
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
    );

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
