import { ParticipantEntity } from "src/declarations/entities/participant";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
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
    description: "a description",
    ownerId: "an owner id",
    goalLabel: "goal label",
    goalType: "done",
    goalSymbol: "g",
    createdAt: new Date(),
  });

  const performanceRepository = new MockRepository<PerformanceEntity>();

  performanceRepository.find.mockResolvedValue(
    [...Array(10)].map((_, i) => ({
      id: `id ${i}`,
      userId: "an user id",
      roomId: "an room Id",
      value: 1,
      createdAt: new Date(),
    })),
  );

  const userRepository = new MockRepository<UserEntity>();

  userRepository.findOne.mockResolvedValue({
    id: "an id",
    name: "a name",
    email: "an email",
    avatarId: "an avatar id",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  const usecase = new FindMyRoomsUsecase(
    authProvider,
    roomRepository,
    performanceRepository,
    participantRepository,
    userRepository,
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
