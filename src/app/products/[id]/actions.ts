"use server"

import { createCart, getCart } from "@/lib/db/carts"
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productId: string){
   //if cart exists get the cart, if not create one
   const cart = (await getCart()) ?? (await createCart());
   //locate the article in the cart
   const articleInCart = cart.CartItem.find(item=>item.productId===productId);

   //if article exists, increment the quantity by one
   if(articleInCart){
      await prisma.cartItem.update({
         where:{id:articleInCart.id},
         data:{quantity:{increment:1}}
      })
   //if article does not exists, add 1 to the quantity
   }else{
      await prisma.cartItem.create({
         data:{
            cartId:cart.id,
            productId,
            quantity:1
         }
      })
   }

   //refreshing the window in a server side component so ti reflect the new changed cart quantity
   revalidatePath("/products/[id]");
}