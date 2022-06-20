import { AuthEntity } from "src/declarations/entities/auth";
import { MockAppleAuthProvider } from "src/implementations/providers/apple_auth/mock";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/implementations/providers/google_auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockKakaoAuthProvider } from "src/implementations/providers/kakao_auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { SignInUseCase } from "./usecase";

describe("Try to sign in", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("new access token");

  authProvider.issueRefreshToken.mockResolvedValue("new refresh token");

  const appleAuthProvider = new MockAppleAuthProvider();

  appleAuthProvider.verify.mockResolvedValue(true);

  appleAuthProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const googleAuthProvider = new MockGoogleAuthProvider();

  googleAuthProvider.verify.mockResolvedValue(true);

  googleAuthProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const kakaoAuthProvider = new MockKakaoAuthProvider();

  kakaoAuthProvider.verify.mockResolvedValue(true);

  kakaoAuthProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockImplementation(async (value) => value);

  const authRepository = new MockRepository<AuthEntity>();

  authRepository.findOne.mockResolvedValue({
    id: "an id",
    key: "a key",
    from: "somewhere",
    accessToken: "an access token",
    refreshToken: "an refresh token",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  const usecase = new SignInUseCase(
    authProvider,
    appleAuthProvider,
    googleAuthProvider,
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
    googleAuthProvider.verify.mockResolvedValueOnce(false);

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
    authRepository.findOne.mockResolvedValueOnce(null);

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
