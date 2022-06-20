import { ParticipantEntity } from "src/declarations/entities/participant";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { MockRepository } from "src/implementations/repositories/mock";
import { FindRoomsUseCase } from "./usecase";

describe("Try to find rooms", () => {
  const roomRepository = new MockRepository<RoomEntity>();

  roomRepository.find.mockResolvedValue(
    [...Array(10)].map((_, i) => ({
      id: `id ${i}`,
      title: "a title",
      description: "a description",
      ownerId: "an owner id",
      goalLabel: "goal label",
      goalType: "done",
      goalSymbol: "g",
      createdAt: new Date(),
    })),
  );

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.count.mockResolvedValue(10);

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

  const usecase = new FindRoomsUseCase(
    roomRepository,
    performanceRepository,
    participantRepository,
    userRepository,
  );

  it("should be ok", async () => {
    const result = await usecase.execute({});

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.items.length).toBe(10);
  });
});
