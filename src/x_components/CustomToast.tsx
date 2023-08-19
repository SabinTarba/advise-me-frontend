import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { LiaExclamationTriangleSolid } from "react-icons/lia";
import { AiOutlineCheckCircle } from "react-icons/ai";


export function CustomToast({ description, variant = "default"} : { description: string | null | undefined, variant? : "default" | "success" | "fail" | null | undefined }) {
  const { toast } = useToast();

  useEffect(() => {
    const toastActionImage = variant === "fail" ? <LiaExclamationTriangleSolid className="text-4xl"/> : <AiOutlineCheckCircle className="text-4xl"/>

    toast({
        variant: variant,
        title: variant?.toUpperCase(),
        description: description,
        action: <ToastAction altText="[]" className="border-0 hover:bg-inherit cursor-auto">{toastActionImage}</ToastAction>
    })

  }, [description, variant, toast ]);
 
  return (
    <>
    </>
  )
}