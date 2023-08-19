import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
 
export function CustomAlert({ message, variant} : {message: string | null, variant: "fail" | "success" | "default" | null} ) {
  return (
    <Alert variant={variant} className="flex justify-center">
      {variant === "success" && <CheckCircledIcon color="green" className="h-7 w-7" />}
      {variant === "fail" && <ExclamationTriangleIcon className="h-7 w-7" />}
        <AlertDescription className="font-bold mt-1">
          {message}
        </AlertDescription>
    </Alert>
  )
}