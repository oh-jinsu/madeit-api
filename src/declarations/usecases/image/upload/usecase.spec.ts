import { ImageEntity } from "src/declarations/entities/image";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageProvider } from "src/implementations/providers/image/mock";
import { MockUuidProvider } from "src/implementations/providers/uuid/mock";
import { MockFileRepository } from "src/implementations/repositories/file/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { UploadImageUseCase } from "./usecase";

describe("Try to upload image", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.v4.mockReturnValue("an uuid");

  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "sub",
  });

  const imageProvider = new MockImageProvider();

  imageProvider.resize.mockResolvedValue(Buffer.from("image"));

  const imageRepository = new MockRepository<ImageEntity>();

  imageRepository.create.mockResolvedValue({});

  imageRepository.save.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    createdAt: new Date(),
  });

  const fileRepository = new MockFileRepository();

  const usecase = new UploadImageUseCase(
    authProvider,
    uuidProvider,
    imageProvider,
    imageRepository,
    fileRepository,
  );

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
