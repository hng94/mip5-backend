import { registerEnumType } from "type-graphql";

export enum SortEnum {
  COMMENT_COUNT = "commentCount",
  LIKE_COUNT = "likeCount",
}

export enum OrderStatus {
  Process = "Process",
  Shipping = "Shipping",
  Delivered = "Delivered",
  Canceled = "Canceled",
}

registerEnumType(OrderStatus, {
  name: "OrderStatus", // this one is mandatory
  description: "OrderStatus", // this one is optional
});
