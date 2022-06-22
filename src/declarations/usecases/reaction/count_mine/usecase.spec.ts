import { ChatEntity } from "src/declarations/entities/chat";
import { ComeOnReactionEntity } from "src/declarations/entities/reactions/come_on";
import { GoodReactionEntity } from "src/declarations/entities/reactions/good";
import { LoveReactionEntity } from "src/declarations/entities/reactions/love";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { CountMyReactionsUseCase } from "./usecase";

describe("Try to count my reactions", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({
    sub: "an id",
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

  const usecase = new CountMyReactionsUseCase(
    authProvider,
    chatRepository,
    goodReactionRepository,
    loveReactionRepository,
    comeOnReactionRepository,
  );

  it("should be ok", async () => {
    const result = await usecase.execute({
      accessToken: "an access token",
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeDefined();
  });
});
