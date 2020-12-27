import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, PrimaryColumn, ObjectIdColumn } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;

  @Column()
  userUsername: string;
}
