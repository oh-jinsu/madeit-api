import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { MockAuthProvider } from "src/infrastructure/providers/auth/mock";
import { MockUuidProvider } from "src/infrastructure/providers/uuid/mock";
import { MockRepository } from "src/infrastructure/repositories/mock";
import { CreateRoomUseCase } from "./usecase";

describe("Try to create a room", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.v4.mockReturnValue("an uuid");

  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

  const roomRepository = new MockRepository<RoomEntity>();

  roomRepository.create.mockResolvedValue({
    id: "an id",
    title: "a title",
    createdAt: new Date(),
  });

  roomRepository.save.mockResolvedValue({
    id: "an id",
    title: "a title",
    createdAt: new Date(),
  });

  const participantRepository = new MockRepository<ParticipantEntity>();

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

  const usecase = new CreateRoomUseCase(
    authProvider,
    uuidProvider,
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
