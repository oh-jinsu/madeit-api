import { ParticipantEntity } from "src/declarations/entities/participant";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockUuidProvider } from "src/implementations/providers/uuid/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CreateParticipantUseCase } from "./usecase";

describe("Try to create a participant", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.generate.mockReturnValue("an uuid");

  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const userRepository = new MockRepository<UserEntity>();

  userRepository.findOne.mockResolvedValue({
    id: "an id",
    name: "a name",
    avatarId: "an avatar id",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

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

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.findOne.mockResolvedValue(null);

  participantRepository.create.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
  });

  participantRepository.save.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
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

  const usecase = new CreateParticipantUseCase(
    authProvider,
    uuidProvider,
    userRepository,
    roomRepository,
    participantRepository,
    performanceRepository,
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

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(null);

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

  it("should fail for an absent room", async () => {
    roomRepository.findOne.mockResolvedValueOnce(null);

    const params = {
      accessToken: "an access token",
      roomId: "a room id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should fail for an absent room", async () => {
    participantRepository.findOne.mockResolvedValueOnce({
      id: "an id",
      userId: "an user id",
      roomId: "a room id",
      joinedAt: new Date(),
    });

    const params = {
      accessToken: "an access token",
      roomId: "a room id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);
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
