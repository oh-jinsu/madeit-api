import { ParticipantEntity } from "src/declarations/entities/participant";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { DeleteParticipantUseCase } from "./usecase";

describe("Try to create a participant", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.findOne.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
  });

  participantRepository.delete.mockResolvedValue(null);

  const usecase = new DeleteParticipantUseCase(
    authProvider,
    participantRepository,
  );

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "an access token",
      roomId: "a room id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an absent participant", async () => {
    participantRepository.findOne.mockResolvedValueOnce(null);

    const params = {
      accessToken: "an access token",
      roomId: "a room id",
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
      roomId: "a room id",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeDefined();
  });
});
