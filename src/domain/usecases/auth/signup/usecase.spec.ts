import { None, Some } from "src/domain/common/enum";
import { MockAppleAuthProvider } from "src/infrastructure/providers/apple_auth/mock";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/infrastructure/providers/google_auth/mock";
import { MockHashProvider } from "src/infrastructure/providers/hash/mock";
import { MockKakaoAuthProvider } from "src/infrastructure/providers/kakao_auth/mock";
import { MockAuthRepository } from "src/infrastructure/repositories/auth/mock";
import { SignUpUseCase } from "./usecase";

describe("Try to sign up with apple", () => {
  const authProvider = new MockAuthProvider();

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

  hashProvider.encode.mockResolvedValue("a hashed value");

  const usecase = new SignUpUseCase(
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

  it("should fail for a existing user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new Some(null));

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
