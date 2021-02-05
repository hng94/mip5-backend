import {
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
import slugify from "slugify";
import { Timeline } from "./timeline.entity";
import { IsPositive } from "class-validator";
import { Comment } from "./comment.entity";
import { SortEnum } from "../common/enum";
import { Like } from "./like.entity";

@Entity()
export class Project extends BaseClass {
  @Column()
  title!: string;

  @Column()
  subTitle!: string;

  @ManyToOne(() => Category, (category) => category.projects, { eager: true })
  category!: Category;

  @Column({ default: "" })
  story: string = "";

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  creator!: User;

  @OneToMany(() => Timeline, (timeline) => timeline.project, { eager: true })
  timelines: Timeline[];

  @ManyToMany(() => User)
  @JoinTable()
  backers: User[];

  @OneToMany(() => Product, (product) => product.project, {
    eager: true,
  })
  products: Product[];

  @OneToMany(() => Like, (like) => like.project, { eager: true })
  likes: Like[];

  @Column({ default: 0 })
  @IsPositive()
  likeCount: number = 0;

  @OneToMany(() => Comment, (comment) => comment.project, { eager: true })
  comments: Comment[];

  @Column({ default: 0 })
  @IsPositive()
  commentCount: number = 0;

  // @BeforeInsert()
  // slugifyProjectName() {
  //   this.subTitle = slugify(this.title);
  // }

  @BeforeUpdate()
  updateProperties() {
    // this.subTitle = slugify(this.title);
    this.commentCount = this.comments ? this.comments.length : 0;
    this.likeCount = this.likes ? this.likes.length : 0;
  }
}

export class QueryProjectInput {
  id?: string;

  searchKey?: string;

  categoryId?: string;

  creatorId?: string;

  order?: SortEnum = null;

  take?: number = 9;

  skip?: number = 0;
}

export class CreateProjectInput {
  title: string;

  subTitle: string;

  creatorEmail: string;

  categoryId: string;

  story: string;

  product: Partial<Product>;

  startDate: Date;

  duration: number;
}
