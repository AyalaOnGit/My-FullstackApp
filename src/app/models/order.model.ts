export interface OrderDTO {
  orderDate: string;
  orderId: number;
  orderSum: number;
  userId: number;
  status: string;
  orderItems: OrderItemDTO[];
}

export interface OrderItemDTO {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  popularColor:string;
  customText:string;
}