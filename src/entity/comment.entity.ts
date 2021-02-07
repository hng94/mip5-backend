import { IsPositive } from "class-validator";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseClass } from "./base.entity";
import { Like } from "./like.entity";
import { Product } from "./product.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity()
export class Comment extends BaseClass {
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  creator!: User;

  @ManyToOne(() => Project, (proj) => proj.comments, { nullable: false })
  project: Project;

  @Column({ nullable: false })
  content!: string;

  @Column()
  @IsPositive()
  likeCount: number = 0;

  @OneToMany(() => Like, (like) => like.comment, {
    eager: true,
  })
  likes: Like[];

  @BeforeUpdate()
  updateProperties() {
    this.likeCount = this.likes.length;
  }
}
