import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { UpdateMeUseCase } from "./usecase";

describe("Try to update me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

  const userRepository = new MockRepository<UserEntity>();

  userRepository.findOne.mockResolvedValue({
    id: "an id",
    name: "the name",
    email: "an email",
    avatarId: "an avatar",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  const usecase = new UpdateMeUseCase(authProvider, userRepository);

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken, dtos: [] });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(null);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken, dtos: [] });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({
      accessToken,
      dtos: [],
    });

    if (!result.isOk()) {
      fail();
    }

    const { id, email, name, avatarId, updatedAt, createdAt } = result.value;

    expect(id).toBeDefined();
    expect(email).toBeDefined();
    expect(name).toBeDefined();
    expect(avatarId).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});
