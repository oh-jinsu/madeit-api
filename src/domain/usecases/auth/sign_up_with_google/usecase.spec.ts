import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/infrastructure/providers/google_auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { SignUpWithGoogleUseCase } from "./usecase";

describe("Try to sign up with google", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    id: "an id",
  });

  authProvider.issueAccessToken.mockResolvedValue("an access token");

  authProvider.issueRefreshToken.mockResolvedValue("an refresh token");

  const authRepository = new MockAuthRepository();

  authRepository.findOneByKey.mockResolvedValue(new None());

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

  const googleAuthProvider = new MockGoogleAuthProvider();

  googleAuthProvider.verify.mockResolvedValue(true);

  googleAuthProvider.extractClaim.mockResolvedValue({
    id: "an id",
    email: "an email",
  });

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockResolvedValue("a hashed value");

  const userRepository = new MockUserRepository();

  userRepository.delete.mockResolvedValue(null);

  const usecase = new SignUpWithGoogleUseCase(
    authProvider,
    googleAuthProvider,
    hashProvider,
    authRepository,
    userRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for a invalid id token", async () => {
    googleAuthProvider.verify.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for a existing user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new Some(null));

    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
