import { getCart } from "@/lib/db/carts"
import CartEntry from "./cartEntry";


export const metadata={
   title:"Your cart - overview"
}

export default async function CartPage(){
   const cart = await getCart();

   return (
      <div>
         <h1 className="mb-6 text-3xl font-bold">
            Your cart:
         </h1>
         {
            cart?.CartItem.map(item=>{
               return (
                  <CartEntry
                     cartItem={item}
                     key={item.id}
                  />
               )
            })
         }
      </div>
   )
}