import PriceTag from "@/components/priceTag";
import { prisma } from "@/lib/db/prisma"
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps{
   params:{
      id: string
   }
}

//we dont wanna make two request separitly one to generate metadata and another to find product, so we use cache
const getProduct=cache(async (id:string)=>{
   const product = await prisma.product.findUnique({where:{id}});
   if(!product) return notFound();
   return product;
})

export async function generateMetadata(id:string):Promise<Metadata>{
   const product = await getProduct(id);
   return {
      title: product.name,
      description: product.description,
      openGraph:{
         images:[{url: product.imageUrl}]
      }
   }
}

export default async function ProductPage(
   {params:{id}}:ProductPageProps
){
   const product = await getProduct(id);
   
   return ( 
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
         <Image
            src={product.imageUrl}
            alt={product.description}
            height={500}
            width={500}
            className="rounded-lg"
            priority
         />
         <div>
            <h1 className="text-5xl font-bold">{product.name}</h1>
            <PriceTag price={product.price} className="mt-4"/>
            <p className="py-6">{product.description}</p>
            <AddToCartButton productId={product.id} incrementProductQuantity={incrementProductQuantity}/>
         </div>
      </div>
   )
}