import { getCart } from "@/lib/db/carts"
import CartEntry from "./cartEntry";
import {setCartQuantity} from './actions';
import { formatPrice } from "@/lib/format";

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
                     setProductQuantity={setCartQuantity}
                     key={item.id}
                  />
               )
            })
         }
         {!cart?.CartItem.length && <p>Your cart is empty</p>}
         <div className="flex flex-col items-end sm:items-center">
            <p className="mb-3 font-bold">Your Total: {formatPrice(cart?.subTotal || 0)}</p>
            <button className="btn btn-primary sm:w-[200px]">Checkout</button>
         </div>
      </div>
   )
}