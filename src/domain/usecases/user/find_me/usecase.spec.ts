import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { FindMeUseCase } from "./usecase";

describe("Try to find me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id", grade: "member" });

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id) =>
      new Some({
        id,
        email: "an email",
        name: "a name",
        avatarId: "an avatar",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new FindMeUseCase(authProvider, userRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

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
