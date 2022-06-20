import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockUuidProvider } from "src/implementations/providers/uuid/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CreateRoomUseCase } from "./usecase";

describe("Try to create a room", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.generate.mockReturnValue("an uuid");

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

  const userRepository = new MockRepository<UserEntity>();

  userRepository.findOne.mockResolvedValue({
    id: "an id",
    name: "a name",
    email: "an email",
    avatarId: "an avatar id",
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  const usecase = new CreateRoomUseCase(
    authProvider,
    uuidProvider,
    roomRepository,
    participantRepository,
    userRepository,
  );

  it("should fail for the too short title", async () => {
    const accessToken = "an access token";
    const title = "타";
    const description = "a description";
    const goalLabel = "성공률";
    const goalType = "done";
    const goalSymbol = "%";

    const result = await usecase.execute({
      accessToken,
      title,
      description,
      goalLabel,
      goalType,
      goalSymbol,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for the too long title", async () => {
    const accessToken = "an access token";
    const title = Array(33).fill("가").join("");
    const description = "a description";
    const goalLabel = "성공률";
    const goalType = "done";
    const goalSymbol = "%";

    const result = await usecase.execute({
      accessToken,
      title,
      description,
      goalLabel,
      goalType,
      goalSymbol,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const accessToken = "an access token";
    const title = Array(32).fill("가").join("");
    const description = "a description";
    const goalLabel = "성공률";
    const goalType = "done";
    const goalSymbol = "%";

    const result = await usecase.execute({
      accessToken,
      title,
      description,
      goalLabel,
      goalType,
      goalSymbol,
    });

    if (!result.isOk()) {
      fail();
    }

    for (const something in Object.values(result.value)) {
      expect(something).toBeDefined();
    }
  });
});
