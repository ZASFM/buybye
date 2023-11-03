import Link from "next/link";

interface PaginationBarProps{
   currentPage: number
   totalPages: number
}

export default function PaginationBar({currentPage, totalPages}:PaginationBarProps){

   const maxPage = Math.min(totalPages,Math.max(currentPage+4,10));
   const minPage = Math.min(1,Math.min(currentPage-5,maxPage-9));

   const numberPageElement:JSX.Element[]=[];

   for(let page = minPage;page<+maxPage;page++){
      numberPageElement.push(
         <Link
            href={`?page${page}`}
            className={`join-item btn ${currentPage===page?"btn-active pointers-events-none":""}`}
         >
            {page}
         </Link>
      )
   }

   return (
      <div className="join">
         {numberPageElement}
      </div>
   )
}