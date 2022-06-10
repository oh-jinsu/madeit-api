import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockParticipantRepository } from "src/infrastructure/repositories/participant/mock";
import { DeleteParticipantUseCase } from "./usecase";

describe("Try to create a participant", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    id: "an id",
  });

  const participantRepository = new MockParticipantRepository();

  participantRepository.findOne.mockResolvedValue(
    new Some({
      id: "an id",
      userId: "an user id",
      roomId: "a room id",
      joinedAt: new Date(),
    }),
  );

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
    participantRepository.findOne.mockResolvedValueOnce(new None());

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
