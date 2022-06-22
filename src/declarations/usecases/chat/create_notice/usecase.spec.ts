import { ChatEntity } from "src/declarations/entities/chat";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { MockUuidProvider } from "src/implementations/providers/uuid/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CreateNoticeChatUseCase } from "./usecase";

describe("Try to create a notice chat", () => {
  const uuidProvider = new MockUuidProvider();

  uuidProvider.generate.mockReturnValue("an uuid");

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

  const usecase = new CreateNoticeChatUseCase(
    uuidProvider,
    chatRepository,
    chatMessageRepository,
  );

  it("should be ok", async () => {
    const roomId = "room id";

    const message = "message";

    const result = await usecase.execute({
      roomId,
      message,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeDefined();
  });
});
