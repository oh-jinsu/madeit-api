import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { UpdateMeUseCase } from "./usecase";

describe("Try to update me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id" });

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id) =>
      new Some({
        id,
        name: "the name",
        email: "an email",
        avatarId: "an avatar",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  userRepository.update.mockImplementation(
    async (id, { name, email, avatarId }) => ({
      id,
      name: name || "a name",
      email,
      avatarId,
      updatedAt: new Date(),
      createdAt: new Date(),
    }),
  );

  const usecase = new UpdateMeUseCase(authProvider, userRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

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
    userRepository.findOne.mockResolvedValueOnce(new None());

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
