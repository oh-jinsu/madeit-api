import { None, Some } from "src/domain/common/enum";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockParticipantRepository } from "src/infrastructure/repositories/participant/mock";
import { MockRoomRepository } from "src/infrastructure/repositories/room/mock";
import { MockUserRepository } from "src/infrastructure/repositories/user/mock";
import { CreateParticipantUseCase } from "./usecase";

describe("Try to create a participant", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    id: "an id",
  });

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockResolvedValue(
    new Some({
      id: "an id",
      name: "a name",
      avatarId: "an avatar id",
      updatedAt: new Date(),
      createdAt: new Date(),
    }),
  );

  const roomRepository = new MockRoomRepository();

  roomRepository.findOne.mockResolvedValue(
    new Some({
      id: "an id",
      title: "a title",
      createdAt: new Date(),
    }),
  );

  const participantRepository = new MockParticipantRepository();

  participantRepository.findOne.mockResolvedValue(new None());

  participantRepository.create.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
  });

  const usecase = new CreateParticipantUseCase(
    authProvider,
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
    userRepository.findOne.mockResolvedValueOnce(new None());

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
    roomRepository.findOne.mockResolvedValueOnce(new None());

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
    participantRepository.findOne.mockResolvedValueOnce(
      new Some({
        id: "an id",
        userId: "an user id",
        roomId: "a room id",
        joinedAt: new Date(),
      }),
    );

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
