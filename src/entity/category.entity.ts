import { Column, Entity, OneToMany } from "typeorm";
import { BaseClass } from "./base.entity";
import { Project } from "./project.entity";

@Entity()
export class Category extends BaseClass {
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects?: Project[];
}
