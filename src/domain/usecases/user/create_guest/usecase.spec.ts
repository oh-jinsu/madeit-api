import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { CreateGuestUseCase } from "./usecase";

describe("Try to create me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id", grade: "guest" });

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockResolvedValue(new None());

  userRepository.save.mockImplementation(
    async ({ id, name, email, avatarId: avatar }) => ({
      id,
      email,
      name,
      avatarId: avatar,
      updatedAt: new Date(),
      createdAt: new Date(),
    }),
  );

  const usecase = new CreateGuestUseCase(authProvider, userRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatarId: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for a conflict", async () => {
    userRepository.findOne.mockResolvedValueOnce(new Some(null));

    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatarId: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatarId: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    const { id, name, updatedAt, createdAt } = result.value;

    expect(id).toBeDefined();
    expect(name).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});
