import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ParticipantEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  roomId: string;

  @CreateDateColumn()
  joinedAt: Date;
}
