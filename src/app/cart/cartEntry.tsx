"use client"
import Image from 'next/image';
import {CartItemWithProduct} from '../../lib/db/carts';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { useTransition } from 'react';

interface CartEntryProps{
   cartItem: CartItemWithProduct,
   setProductQuantity:(productId: string, quantity: number)=>Promise<void>
}

export default function CartEntry
(
   {
      cartItem:{
         product, 
         quantity
      },
      setProductQuantity
   }:CartEntryProps
){

   //adding options to the dropdown for quantity
   const options:JSX.Element[] =[];
   for(let i = 0;i<=99;i++){
      options.push(
         <option value={i} key={i}>
            {i}
         </option>
      )
   } 

   const [isPending, startTransition]=useTransition();

   return (
      <div>
         <div className='flex flex-wrap gap-3 items-center'>
            <Image
               src={product.imageUrl}
               alt='product image'
               height={200}
               width={200}
               className='rounded-lg'
            />
            <div>
               <Link href={'/products/'+product.id} className='font-bold'>
                  {product.name}
               </Link>
            </div>
            <div>Price: {formatPrice(product.price)}</div>
            <div className='my-1 flex items-center gap-2'>
               <select
                  defaultValue={quantity}
                  className='select select-border w-full max-w-[80px]'
                  onChange={(e)=>{
                     const newQuantity = parseInt(e.currentTarget.value);
                     startTransition(async()=>{
                        await setProductQuantity(product.id,newQuantity);
                     })
                  }}
               >
                  <option value={0}>0 (Remove)</option>
                  {options}
               </select>
            </div>
            <div>
               Total: {formatPrice(product.price*quantity)}
               {isPending && (
                  <span className='loading loading-spinner loading-sm'></span>
               )}
            </div>
         </div>
         <div className='divider'></div>
      </div>
   )
}