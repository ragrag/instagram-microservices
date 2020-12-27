import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, Index, ObjectIdColumn, PrimaryColumn, ObjectID } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  photo: string;

  @Index()
  @Column({ nullable: true })
  caption: string;

  @Column()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Index()
  userId: number;

  @Column()
  @Index()
  userUsername: string;

  @Column(type => Comment)
  comments: Comment[];
}
