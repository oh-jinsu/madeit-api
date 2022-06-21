import { ChatEntity } from "src/declarations/entities/chat";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
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
    maxParticipant: 10,
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

  const chatRepository = new MockRepository<ChatEntity>();

  chatRepository.find.mockResolvedValue(
    [...Array(10)].map((_, i) => ({
      id: "id",
      roomId: "room id",
      userId: "user id",
      type: (() => {
        switch (i % 3) {
          case 1:
            return "message";
          case 2:
            return "image";
          default:
            return "photolog";
        }
      })(),
      createdAt: new Date(),
    })),
  );

  const chatMessageRepository = new MockRepository<ChatMessageEntity>();

  chatMessageRepository.findOne.mockResolvedValue({
    chatId: "chat id",
    message: "message",
  });

  const chatImageRepository = new MockRepository<ChatImageEntity>();

  chatImageRepository.find.mockResolvedValue(
    [...Array(3)].map(() => ({
      id: "id",
      chatId: "chat id",
      imageId: "image id",
    })),
  );

  const chatPhotologRepository = new MockRepository<ChatPhotologEntity>();

  chatPhotologRepository.findOne.mockResolvedValue({
    chatId: "chat id",
    isChecked: false,
  });

  const usecase = new FindMyRoomsUsecase(
    authProvider,
    roomRepository,
    performanceRepository,
    participantRepository,
    userRepository,
    chatRepository,
    chatMessageRepository,
    chatImageRepository,
    chatPhotologRepository,
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
