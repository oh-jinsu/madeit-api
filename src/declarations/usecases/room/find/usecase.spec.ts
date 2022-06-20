import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { MockRepository } from "src/implementations/repositories/mock";
import { FindRoomsUseCase } from "./usecase";

describe("Try to find rooms", () => {
  const roomRepository = new MockRepository<RoomEntity>();

  roomRepository.find.mockResolvedValue(
    [...Array(10)].map((_, i) => ({
      id: `id ${i}`,
      title: "a title",
      createdAt: new Date(),
    })),
  );

  const participantRepository = new MockRepository<ParticipantEntity>();

  participantRepository.count.mockResolvedValue(10);

  const usecase = new FindRoomsUseCase(roomRepository, participantRepository);

  it("should be ok", async () => {
    const result = await usecase.execute({});

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.items.length).toBe(10);
  });
});
