import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/infrastructure/providers/google_auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { SignInWithGoogleUseCase } from "./usecase";

describe("test the sign in with google usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("new access token");

  authProvider.issueRefreshToken.mockResolvedValue("new refresh token");

  const googleAuthProvider = new MockGoogleAuthProvider();

  googleAuthProvider.verify.mockResolvedValue(true);

  googleAuthProvider.extractClaim.mockResolvedValue({
    id: "an id",
    email: "an email",
  });

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockImplementation(async (value) => value);

  const authRepository = new MockAuthRepository();

  authRepository.findOneByKey.mockImplementation(
    async (key) =>
      new Some({
        id: "an id",
        key,
        from: "somewhere",
        accessToken: "an access token",
        refreshToken: "an refresh token",
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

  const usecase = new SignInWithGoogleUseCase(
    authProvider,
    googleAuthProvider,
    hashProvider,
    authRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid id token", async () => {
    googleAuthProvider.verify.mockResolvedValueOnce(false);

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an absent user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new None());

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should return an access token and a refresh token", async () => {
    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
