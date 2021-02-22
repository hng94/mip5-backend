import { AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { OrderStatus } from "../common/enum";
import { AuthContext } from "../common/type";
import { Order } from "../entity/order.entity";
import { Product } from "../entity/product.entity";
import { User } from "../entity/user.entity";
import {
  CreateOrderInput,
  OrderDTO,
  UpdateOrderInput,
} from "../schema/order.schema";

@Resolver(Order)
export class OrderResolver {
  @Authorized()
  @Query(() => [OrderDTO])
  async myOrders(@Ctx() context: AuthContext) {
    const id = context.currentUser.id;
    const user = await User.findOne(id, {
      relations: ["orders", "orders.product", "orders.product.project"],
      withDeleted: false,
    });
    const myOrders = user.orders.filter((order) => order.deletedDate == null);
    return myOrders;
  }

  @Authorized()
  @Mutation(() => OrderDTO)
  async createOrder(
    @Arg("data") data: CreateOrderInput,
    @Ctx() context: AuthContext
  ) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser.id);
      const product = await Product.findOne(data.productId);
      const newOrder = await Order.create();
      newOrder.creator = creator;
      newOrder.product = product;
      newOrder.quantity = data.quantity;
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => OrderDTO)
  async cancelOrder(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      const { currentUser } = context;
      const order = await Order.findOne(id, {
        relations: ["creator", "product"],
      });
      if (order.creator.id !== currentUser.id) {
        throw new AuthenticationError("Invalid User");
      }
      order.status = OrderStatus.Canceled;
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  //Only Creator can update order status
  @Authorized()
  @Mutation(() => OrderDTO)
  async updateOrder(
    @Arg("data") data: UpdateOrderInput,
    @Ctx() context: AuthContext
  ) {
    try {
      const { currentUser } = context;
      const order = await Order.findOne(data.productId, {
        relations: ["creator"],
      });
      if (order.product.project.creator.id !== currentUser.id) {
        throw new AuthenticationError("Invalid User");
      }
      order.status = data.status;
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => String)
  async removeOrder(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      const { currentUser } = context;
      const order = await Order.findOne(id, { relations: ["creator"] });
      if (order.creator.id !== currentUser.id) {
        throw new AuthenticationError("Invalid User");
      }
      await Order.softRemove(order);
      return id;
    } catch (error) {
      throw error;
    }
  }
}
