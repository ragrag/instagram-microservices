import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, Index, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
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

  @Column({ nullable: false })
  @Index()
  userId: number;

  @OneToMany(() => Comment, comment => comment.post)
  @JoinTable()
  comments: Comment[];
}
