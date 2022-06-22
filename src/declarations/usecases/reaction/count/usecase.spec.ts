import { ChatEntity } from "src/declarations/entities/chat";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { ComeOnReactionEntity } from "src/declarations/entities/reactions/come_on";
import { GoodReactionEntity } from "src/declarations/entities/reactions/good";
import { LoveReactionEntity } from "src/declarations/entities/reactions/love";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CountReactionsUseCase } from "./usecase";

describe("Try to count my reactions", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "an id",
  });

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.findOne.mockResolvedValue({
    id: "an id",
    userId: "an user id",
    roomId: "a room id",
    joinedAt: new Date(),
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

  const goodReactionRepository = new MockRepository<GoodReactionEntity>();

  goodReactionRepository.count.mockResolvedValue(10);

  const loveReactionRepository = new MockRepository<LoveReactionEntity>();

  loveReactionRepository.count.mockResolvedValue(10);

  const comeOnReactionRepository = new MockRepository<ComeOnReactionEntity>();

  comeOnReactionRepository.count.mockResolvedValue(10);

  const usecase = new CountReactionsUseCase(
    authProvider,
    participantRepository,
    chatRepository,
    goodReactionRepository,
    loveReactionRepository,
    comeOnReactionRepository,
  );

  it("should fail for an absent user", async () => {
    participantRepository.findOne.mockResolvedValueOnce(null);

    const result = await usecase.execute({
      accessToken: "an access token",
      userId: "user id",
      roomId: "room id",
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should fail for an absent user", async () => {
    participantRepository.findOne.mockResolvedValueOnce({
      id: "an id",
      userId: "an user id",
      roomId: "a room id",
      joinedAt: new Date(),
    });
    participantRepository.findOne.mockResolvedValueOnce(null);

    const result = await usecase.execute({
      accessToken: "an access token",
      userId: "user id",
      roomId: "room id",
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
  });

  it("should be ok", async () => {
    const result = await usecase.execute({
      accessToken: "an access token",
      userId: "user id",
      roomId: "room id",
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeDefined();
  });
});
