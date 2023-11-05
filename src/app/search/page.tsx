import ProductCard from "@/components/productCard";
import { prisma } from "@/lib/db/prisma"
import { Metadata } from "next";

interface SearchPageProps{
   searchParams:{query:string}
}

export function generateMetadata({
   searchParams:{query}
}:SearchPageProps):Metadata{
   return {
      title:`Search for: ${query}`
   }
}

export default async function SearchPage({searchParams:{query}}:SearchPageProps){
   const products=await prisma.product.findMany({
      where:{
         OR:[
            {name:{contains:query,mode:'insensitive'}},
            {description:{contains:query,mode:'insensitive'}}
         ]
      },
      orderBy:{id:'desc'}
   });

   if(products.length===0){
      return (
         <div className="text-center">No product find</div>
      )
   }


   return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
         {products.map(product=>(
            <ProductCard product={product} key={product.id}/>
         ))}
      </div>
   )
}