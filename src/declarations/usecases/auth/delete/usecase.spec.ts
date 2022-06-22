import { AuthEntity } from "src/declarations/entities/auth";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockRepository } from "src/implementations/repositories/mock";
import { DeleteAuthUseCase } from "./usecase";

describe("Try to delete the auth", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue({ sub: "an id" });

  const authRepository = new MockRepository<AuthEntity>();

  const userRepository = new MockRepository<UserEntity>();

  const participantRepository = new MockRepository<ParticipantEntity>();

  const roomRepository = new MockRepository<RoomEntity>();

  roomRepository.find.mockResolvedValue([]);

  const usecase = new DeleteAuthUseCase(
    authProvider,
    authRepository,
    userRepository,
    participantRepository,
    roomRepository,
  );

  it("should fail for own rooms", async () => {
    roomRepository.find.mockResolvedValueOnce([
      {
        id: "id",
        title: "title",
        description: "description",
        ownerId: "owner id",
        goalLabel: "label",
        goalSymbol: "g",
        goalType: "done",
        maxParticipant: 10,
        createdAt: new Date(),
      },
    ]);

    const result = await usecase.execute({ accessToken: "an access token" });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
  });

  it("should be ok", async () => {
    const result = await usecase.execute({ accessToken: "an access token" });

    if (!result.isOk()) {
      fail();
    }

    expect(result).toBeDefined();
  });
});
