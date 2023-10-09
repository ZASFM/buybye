import { ComponentProps } from "react";
import { experimental_useFormState as useFormState } from 'react-dom';

type FormSubmitButtonProps = {
   children: React.ReactNode;
   className?: string;
} & ComponentProps<"button">;

export function FromSubmitButton(
   { children, className, ...props }: FormSubmitButtonProps
) {

   const { pending } = useFormState();

   return (
      <button 
         {...props}
         className={`btn btn-primary ${className}`}
         type="submit"
         disabled={pending}
      >
         {pending && <span className="spinner loading-spinner"/>}
         {children}
      </button>
   );
}
