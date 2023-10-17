import Link from 'next/link';
import logo from '@/assets/logo.png';
import Image from 'next/image';
import {redirect} from 'next/navigation';
import { getCart } from '@/lib/db/carts';
import ShoppingCartButton from './ShoppingCartButton';

async function searchProducts(formData:FormData){
   "use server"
   const formDataName=formData.get("querySearch")?.toString();
   if(formDataName){
      redirect("/search?query="+formDataName);
   }
}

export default async function Navbar(){
   const cart = await getCart();

   return (
      <div className="bg-base-100">
         <div className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
            <div className="flex-1">
               <Link 
                  href="/"
                  className='btn btn-ghost text-xl normal-case'

               >
                  <Image
                     src={logo}
                     alt='Logo image'
                     height={40}
                     width={40}
                  />
                  BuyBye
               </Link>
            </div>
            <div className='flex-none gap-2'>
               <form action={searchProducts}>
                  <div className='form-control'>
                     <input
                        type='text'
                        name='querySearch'
                        placeholder='Type here to search'
                        className='input input-bordered w-full in-w-[100px]'
                     />
                  </div>
               </form>
               <ShoppingCartButton cart={cart}/>
            </div>
         </div>
      </div>
   )
}