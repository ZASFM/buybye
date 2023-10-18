"use server"

import { createCart, getCart } from "@/lib/db/carts"
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function setCartQuantity(productId: string, quantity: number){
   //cart is gonna have an array of product (cartItems) that a the user has selected
   const cart = (await getCart()) ?? (await createCart());

   //inside my cartItems im gonna have info about the product (image, name ...), and also other info like the quantity of the item 
   //inside my cart...
   //articleInCart.id is the id of the cartItem inside the Cart,  
   const articleInCart = cart.CartItem.find(item=>item.productId===productId);
   
   //if user sets quantity to zero then delete cartItem from cart:
   if(quantity === 0){

      if(articleInCart){
         await prisma.cartItem.delete({
            where:{id:articleInCart.id}
         })
      }

   }else{

      if(articleInCart){
         await prisma.cartItem.update({
            where:{id:articleInCart.id},
            data:{quantity}
         })
      }else{
         await prisma.cartItem.create({
            data:{
               cartId:cart.id,
               productId,
               quantity
            }
         })
      }
   }
   
   //refreshing the page form a server action
   revalidatePath("/cart");
}