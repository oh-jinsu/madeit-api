import { Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockParticipantRepository } from "src/infrastructure/repositories/participant/mock";
import { MockRoomRepository } from "src/infrastructure/repositories/room/mock";
import { FindMyRoomsUsecase } from "./usecase";

describe("Try to find my rooms", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ id: "an id" });

  const participantRepository = new MockParticipantRepository();

  participantRepository.findByUserId.mockResolvedValue(
    [...Array(10)].map(() => ({
      id: "an id",
      userId: "a user id",
      roomId: "a room id",
      joinedAt: new Date(),
    })),
  );

  participantRepository.countByRoomId.mockResolvedValue(10);

  const roomRepository = new MockRoomRepository();

  roomRepository.findOne.mockResolvedValue(
    new Some({
      id: "an id",
      title: "a title",
      createdAt: new Date(),
    }),
  );

  const usecase = new FindMyRoomsUsecase(
    authProvider,
    participantRepository,
    roomRepository,
  );

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.length).toBe(10);
  });
});
