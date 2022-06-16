import { None, Some } from "src/domain/common/enum";
import { MockAppleAuthProvider } from "src/infrastructure/providers/apple_auth/mock";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/infrastructure/providers/google_auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockKakaoAuthProvider } from "src/infrastructure/providers/kakao_auth/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { SignInUseCase } from "./usecase";

describe("test the sign in with google usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("new access token");

  authProvider.issueRefreshToken.mockResolvedValue("new refresh token");

  const appleAuthProvider = new MockAppleAuthProvider();

  appleAuthProvider.verify.mockResolvedValue(true);

  appleAuthProvider.extractClaim.mockResolvedValue({
    id: "an id",
    email: "an email",
  });

  const googleAuthPRovider = new MockGoogleAuthProvider();

  googleAuthPRovider.verify.mockResolvedValue(true);

  googleAuthPRovider.extractClaim.mockResolvedValue({
    id: "an id",
    email: "an email",
  });

  const kakaoAuthProvider = new MockKakaoAuthProvider();

  kakaoAuthProvider.verify.mockResolvedValue(true);

  kakaoAuthProvider.extractClaim.mockResolvedValue({
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

  const usecase = new SignInUseCase(
    authProvider,
    appleAuthProvider,
    googleAuthPRovider,
    kakaoAuthProvider,
    hashProvider,
    authRepository,
  );

  it("should fail for an invalid id token from apple", async () => {
    appleAuthProvider.verify.mockResolvedValueOnce(false);

    const provider = "apple";

    const idToken = "an id token";

    const result = await usecase.execute({ provider, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an invalid id token from google", async () => {
    googleAuthPRovider.verify.mockResolvedValueOnce(false);

    const provider = "google";

    const idToken = "an id token";

    const result = await usecase.execute({ provider, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an invalid id token from kakao", async () => {
    kakaoAuthProvider.verify.mockResolvedValueOnce(false);

    const provider = "kakao";

    const idToken = "an id token";

    const result = await usecase.execute({ provider, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an absent user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new None());

    const provider = "apple";

    const idToken = "an id token";

    const result = await usecase.execute({ provider, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const provider = "apple";

    const idToken = "an id token";

    const result = await usecase.execute({ provider, idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
