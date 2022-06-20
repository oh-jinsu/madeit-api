import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { UserEntity } from "src/domain/entities/user";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockUuidProvider } from "src/infrastructure/providers/uuid/mock";
import { MockRepository } from "src/infrastructure/repositories/mock";
import { CreateParticipantUseCase } from "./usecase";

describe("Try to create a participant", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.v4.mockReturnValue("an uuid");

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

  const usecase = new CreateParticipantUseCase(
    authProvider,
    uuidProvider,
    userRepository,
    roomRepository,
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
