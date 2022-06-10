import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockParticipantRepository } from "src/infrastructure/repositories/participant/mock";
import { MockRoomRepository } from "src/infrastructure/repositories/room/mock";
import { CreateRoomUseCase } from "./usecase";

describe("Try to find rooms", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id", grade: "member" });

  const roomRepository = new MockRoomRepository();

  roomRepository.create.mockResolvedValue({
    id: "an id",
    title: "a title",
    createdAt: new Date(),
  });

  const participantRepository = new MockParticipantRepository();

  participantRepository.create.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
  });

  const usecase = new CreateRoomUseCase(
    authProvider,
    roomRepository,
    participantRepository,
  );

  it("should fail for the too short title", async () => {
    const params = {
      accessToken: "an access token",
      title: "타",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for the too long title", async () => {
    const params = {
      accessToken: "an access token",
      title: Array(33).fill("가").join(""),
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "an access token",
      title: Array(32).fill("가").join(""),
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    for (const something in Object.values(result.value)) {
      expect(something).toBeDefined();
    }
  });
});
