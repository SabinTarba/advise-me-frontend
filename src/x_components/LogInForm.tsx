
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API_CALL from "@/x_utils/api"
import { LoadingButton } from "./LoadingButton";
import { CustomAlert } from "./CustomAlert"
import { saveUserLoggedData, setToken } from "@/x_utils/auth"

const FormSchema = z.object({
    email: z.string().email({
      message: "Email format is incorrect.",
    }),
    password: z.string().min(3, {
      message: "Password must be at least 3 characters.",
    })
  })

export function LogInForm() {

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "fail" | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {

    setLoadingButton(true);

    console.log(data);
    
    API_CALL.logInUser(data.email, data.password).then(res => {
        setLoadingButton(false);

        if(res.data.status === "success"){
          saveUserLoggedData(res.data.encryptedData);
          setToken(res.data.token);
          localStorage.setItem("menuTab", "1");
          window.location.replace("/browse");
        } else {
          setAlertMessage(res.data.statusMessage);
          setAlertVariant(res.data.status);
          setShowAlert(true);
        }
     
    })
  }

  return (
    <Form {...form}>

      {showAlert && <CustomAlert message={alertMessage} variant={alertVariant}/>}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col justify-center">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loadingButton && <LoadingButton/>}
        {!loadingButton && <Button type="submit" className="bg-blue-700">Log In</Button>}
      </form>
    </Form>
  )
}
