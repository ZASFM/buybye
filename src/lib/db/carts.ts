import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import {Cart, Prisma} from '@prisma/client';

export type CartWithProducts = Prisma.CartGetPayload<{
   include:{CartItem:{include:{product:true}}}
}>

export type ShoppingCart = CartWithProducts & {
   size: number,
   subTotal: number
}

export async function getCart():Promise<ShoppingCart | null>{
   const localCardId = cookies().get('localCartId')?.value;
   const cart= localCardId?
      await prisma.cart.findUnique({
         where:{
            id:localCardId
         },
         //the cart should also include the products details
         //current model struc => cart (has cartItems) => cartItems (inside cart, has products) => products (info I want to know)
         //we need to go two levels deep from cart => cartItem (level 1) => products (level 2)
         include:{
            CartItem:
               {
                  include: {
                     product:true
                  }
               }
         }
      }):
      null;

      if(!cart){
         return null;
      }
 
   return {
      ...cart,
      size: cart?.CartItem.reduce((acc,curVal)=>acc+curVal.quantity,0),
      subTotal: cart?.CartItem.reduce((acc,curVal)=>acc+curVal.quantity*curVal.product.price,0)
   }
}

export async function createCart():Promise<ShoppingCart>{
   const newCart = await prisma.cart.create({
      data:{}
   });

   //Note: not encrypted, required encryption
   cookies().set('localCarId',newCart.id);

   //passing cart values to the function
   return {
      ...newCart,
      CartItem:[],
      size:0,
      subTotal:0
   }
}