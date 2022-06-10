import { MockParticipantRepository } from "src/infrastructure/repositories/participant/mock";
import { MockRoomRepository } from "src/infrastructure/repositories/room/mock";
import { FindRoomsUseCase } from "./find";

describe("Try to find rooms", () => {
  const roomRepository = new MockRoomRepository();

  roomRepository.find.mockResolvedValue({
    next: "a next",
    items: [...Array(10)].map((_, i) => ({
      id: `id ${i}`,
      title: "a title",
      createdAt: new Date(),
    })),
  });

  const participantRepository = new MockParticipantRepository();

  participantRepository.countByRoomId.mockResolvedValue(10);

  const usecase = new FindRoomsUseCase(roomRepository, participantRepository);

  it("should be ok", async () => {
    const result = await usecase.execute();

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.next).toBeDefined();
    expect(result.value.items.length).toBe(10);
  });
});
