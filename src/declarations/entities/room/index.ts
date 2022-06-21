import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class RoomEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  ownerId: string;

  @Column()
  goalLabel: string;

  @Column()
  goalType: "done" | "number" | "time" | "duration";

  @Column()
  goalSymbol: string;

  @Column()
  maxParticipant: number;

  @CreateDateColumn()
  createdAt: Date;
}
