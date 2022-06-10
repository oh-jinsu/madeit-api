import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockImageRepository } from "src/infrastructure/repositories/image/mock";
import { UploadImageUseCase } from "./usecase";

describe("test the upload image usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    id: "an id",
  });

  const imageRepository = new MockImageRepository();

  imageRepository.save.mockImplementation(async ({ userId }) => ({
    id: "an id",
    userId: userId,
    createdAt: new Date(),
  }));

  const usecase = new UploadImageUseCase(authProvider, imageRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const buffer = Buffer.from([]);

    const mimetype = "image/jpeg";

    const result = await usecase.execute({ accessToken, buffer, mimetype });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should return an image uri", async () => {
    const accessToken = "an access token";

    const buffer = Buffer.from([]);

    const mimetype = "image/jpeg";

    const result = await usecase.execute({ accessToken, buffer, mimetype });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();
    expect(result.value.createdAt).toBeDefined();
  });
});
