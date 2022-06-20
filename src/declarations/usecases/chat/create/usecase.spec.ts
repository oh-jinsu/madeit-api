import { ChatEntity } from "src/declarations/entities/chat";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockUuidProvider } from "src/implementations/providers/uuid/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CreateChatUseCase } from "./usecase";

describe("Try to create chat", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.generate.mockReturnValue("an uuid");

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

  chatRepository.create.mockResolvedValue({});

  chatRepository.save.mockImplementation(async ({ type }) => ({
    id: "id",
    roomId: "room id",
    userId: "user id",
    type,
    createdAt: new Date(),
  }));

  const chatMessageRepository = new MockRepository<ChatMessageEntity>();

  chatMessageRepository.save.mockResolvedValue({
    chatId: "chat id",
    message: "message",
  });

  const chatImageRepository = new MockRepository<ChatImageEntity>();

  chatImageRepository.save.mockResolvedValue({
    id: "id",
    chatId: "chat id",
    imageId: "image id",
  });

  const chatPhotologRepository = new MockRepository<ChatPhotologEntity>();

  chatPhotologRepository.save.mockResolvedValue({
    chatId: "chat id",
    isChekced: false,
  });

  const usecase = new CreateChatUseCase(
    authProvider,
    uuidProvider,
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
    const type = "message";
    const message = "message";

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      message,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(null);

    const accessToken = "access token";
    const roomId = "room id";
    const type = "message";
    const message = "message";

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      message,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an absent participant", async () => {
    participantRepository.findOne.mockResolvedValueOnce(null);

    const accessToken = "access token";
    const roomId = "room id";
    const type = "message";
    const message = "message";

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      message,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should fail for an empty image ids when type is image", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const type = "image";
    const imageIds = [];

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      imageIds,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);
  });

  it("should fail for an empty image ids when the type is photolog", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const type = "photolog";
    const imageIds = [];
    const message = "message";

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      imageIds,
      message,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);
  });

  it("should be ok with message", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const type = "message";
    const message = "message";

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      message,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });

  it("should be ok with image", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const type = "image";
    const imageIds = ["image id"];

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      imageIds,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });

  it("should be ok with photolog", async () => {
    const accessToken = "access token";
    const roomId = "room id";
    const type = "photolog";
    const message = "message";
    const imageIds = ["image id"];

    const result = await usecase.execute({
      accessToken,
      roomId,
      type,
      imageIds,
      message,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });
});
