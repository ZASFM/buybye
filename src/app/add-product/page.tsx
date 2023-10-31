import { prisma } from "@/lib/db/prisma"
import {redirect} from 'next/navigation';
import { FromSubmitButton } from "@/components/formSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata={
   title:'Add product'
}

async function addProduct(formData:FormData){
   "use server"

   //action protection
   const session = await getServerSession(authOptions);
   if(!session) redirect("/api/auth/signin?callBackUrl=/add-product");

   //getting data from server action
   const name=formData.get('name')?.toString();
   const description=formData.get('description')?.toString();
   const imageUrl=formData.get('imageUrl')?.toString();
   const price=Number(formData.get('price') || 0);
 
   //validating the data
   if(!name || !description || !imageUrl || !price){
      throw Error('Field missing');
   }

   //saving data 
   await prisma.product.create({
      data:{
         name,
         description,
         imageUrl,
         price
      }
   });

   //redirecting to the homepage
   redirect('/');
}

export default async function AddProductPage(){
   const session = await getServerSession(authOptions);
   if(!session) redirect("/api/auth/signin?callBackUrl=/add-product");

   return (
      <div>
         <h1 className="font-bold mb-3 text-lg">Add product</h1>
         <form action={addProduct}>
            <input
               required
               type="text"
               name="name"
               className="input input-bordered w-full mb-3"
               placeholder="Product name"
            />
            <textarea
               required
               className="textarea textarea-bordered w-full mb-3"
               name="description"
               placeholder="Description"
            />
            <input
               required
               className="input input-bordered w-full mb-3"
               name="imageUrl"
               placeholder="image URL"
               type="url"
            />
            <input
               required
               className="input input-bordered w-full mb-3"
               name="price"
               placeholder="Price"
               type="number"
            />
            <FromSubmitButton
               type="submit"
               className="btn-block"
            > 
               Add product
            </FromSubmitButton>
         </form>
      </div>
   )
}