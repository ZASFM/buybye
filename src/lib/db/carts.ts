import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import {Cart, Prisma} from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
   include:{CartItem:{include:{product:true}}}
}>

//type for one cart with its products details, used for the cart page
export type CartItemWithProduct=Prisma.CartItemGetPayload<{
   include:{product:true}
}>

//type for the getCart function, includes the size, subtotal alongside with the items from Cart
export type ShoppingCart = CartWithProducts & {
   size: number,
   subTotal: number
}

//shopping cart has both size and subTotal alongside with all the other props cart items info
export async function getCart():Promise<ShoppingCart | null>{
   const session = await getServerSession(authOptions);
   let cart:CartWithProducts | null = null; 

   if(session){
      cart = await prisma.cart.findFirst({
         where:{userId:session.user.id},
         include:{CartItem:{include:{product:true}}}
      })
   }else{
      const localCardId = cookies().get('localCartId')?.value;
      cart= localCardId?
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
   }

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
   const session = await getServerSession(authOptions);

   let newCart:Cart;

   if(session){
      newCart = await prisma.cart.create({
         data:{userId:session.user?.email}
      })
   }else{
      newCart = await prisma.cart.create({
         data:{}
      });
   
      //Note: not encrypted, required encryption
      cookies().set('localCarId',newCart.id);
   }

   //passing cart values to the function
   return {
      ...newCart,
      CartItem:[],
      size:0,
      subTotal:0
   }
}