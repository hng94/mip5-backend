import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { BaseClass } from "./base.entity";
import { Category } from "./category.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";
import { Timeline } from "./timeline.entity";
import { IsPositive } from "class-validator";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";

@Entity()
export class Project extends BaseClass {
  @Column()
  title!: string;

  @Column()
  subTitle!: string;

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Category, (category) => category.projects, {
    eager: true,
    nullable: false,
    cascade: true,
  })
  category!: Category;

  @Column({ default: "" })
  story: string = "";

  @ManyToOne(() => User, (user) => user.projects, {
    eager: true,
    nullable: false,
  })
  creator!: User;

  @OneToMany(() => Timeline, (timeline) => timeline.project, {
    eager: true,
    cascade: true,
  })
  timelines: Timeline[];

  @ManyToMany(() => User)
  @JoinTable()
  backers: User[];

  @OneToMany(() => Product, (product) => product.project, {
    eager: true,
    cascade: true,
  })
  products: Product[];

  @OneToMany(() => Like, (like) => like.project, { eager: true, cascade: true })
  likes: Like[];

  @Column({ default: 0 })
  @IsPositive()
  likeCount: number = 0;

  @OneToMany(() => Comment, (comment) => comment.project, {
    eager: true,
    cascade: true,
  })
  comments: Comment[];

  @Column({ default: 0 })
  @IsPositive()
  commentCount: number = 0;

  @AfterLoad()
  updateProperties() {
    // this.subTitle = slugify(this.title);
    this.commentCount = this.comments ? this.comments.length : 0;
    this.likeCount = this.likes ? this.likes.length : 0;
  }
}
