import { ChatEntity } from "src/declarations/entities/chat";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { FindChatsUseCase } from "./usecase";

describe("Try to find chats", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "sub",
  });

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.findOne.mockResolvedValue({
    id: "id",
    userId: "user id",
    roomId: "room id",
    joinedAt: new Date(),
  });

  const userRepository = new MockRepository<UserEntity>();

  userRepository.findOne.mockResolvedValue({
    id: "id",
    name: "name",
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

  const usecase = new FindChatsUseCase(
    authProvider,
    participantRepository,
    userRepository,
    chatRepository,
    chatMessageRepository,
    chatImageRepository,
    chatPhotologRepository,
  );

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "access token";
    const roomId = "room id";
    const cursor = null;
    const limit = null;

    const result = await usecase.execute({
      accessToken,
      roomId,
      cursor,
      limit,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an invalid access token", async () => {
    participantRepository.findOne.mockResolvedValueOnce(null);

    const accessToken = "access token";
    const roomId = "room id";
    const cursor = null;
    const limit = null;

    const result = await usecase.execute({
      accessToken,
      roomId,
      cursor,
      limit,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should be ok", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const cursor = null;
    const limit = null;

    const result = await usecase.execute({
      accessToken,
      roomId,
      cursor,
      limit,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.items.length).toBe(10);
  });
});
