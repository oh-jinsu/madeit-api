import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockRepository } from "src/infrastructure/repositories/mock";
import { FindMyRoomsUsecase } from "./usecase";

describe("Try to find my rooms", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.find.mockResolvedValue(
    [...Array(10)].map(() => ({
      id: "an id",
      userId: "a user id",
      roomId: "a room id",
      joinedAt: new Date(),
    })),
  );

  participantRepository.count.mockResolvedValue(10);

  const roomRepository = new MockRepository<RoomEntity>();

  roomRepository.findOne.mockResolvedValue({
    id: "an id",
    title: "a title",
    createdAt: new Date(),
  });

  const usecase = new FindMyRoomsUsecase(
    authProvider,
    roomRepository,
    participantRepository,
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
