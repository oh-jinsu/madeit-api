import { InjectRepository } from "@nestjs/typeorm";
import { UseCase } from "src/declarations/common/usecase";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { ChatEntity } from "src/declarations/entities/chat";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatModel } from "src/declarations/models/chat";
import { UuidProvider } from "src/declarations/providers/uuid";
import { Repository } from "typeorm";

export type Params = {
  readonly roomId: string;
  readonly message: string;
};

export type Model = ChatModel;

export class CreateNoticeChatUseCase implements UseCase<Params, Model> {
  constructor(
    private readonly uuidProvider: UuidProvider,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>,
  ) {}

  async execute({
    roomId,
    message,
  }: Params): Promise<UseCaseResult<ChatModel>> {
    const newChat = this.chatRepository.create({
      id: this.uuidProvider.generate(),
      userId: "admin",
      roomId,
      type: "notice",
    });

    const {
      id: chatId,
      userId,
      createdAt,
    } = await this.chatRepository.save(newChat);

    const newChatMessage = this.chatMessageRepository.create({
      chatId,
      message,
    });

    await this.chatMessageRepository.save(newChatMessage);

    return new UseCaseOk({
      id: chatId,
      roomId,
      userId,
      message,
      type: "notice",
      createdAt,
    });
  }
}
