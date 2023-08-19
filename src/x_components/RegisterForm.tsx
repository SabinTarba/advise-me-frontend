
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import API_CALL from "@/x_utils/api"
import { LoadingButton } from "./LoadingButton";
import { CustomAlert } from "./CustomAlert"

const FormSchema = z.object({
    name: z.string().min(3, {
      message: "User name must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Email format is incorrect.",
    }),
    password: z.string().min(3, {
      message: "Password must be at least 3 characters.",
    }),
    age: z.string().min(1, {
      message: "Age must be completed.",
    }),
    description: z.string().max(150, {
      message: "Description must be lower than 150 characters.",
    }).optional()
  })

export function RegisterForm() {

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "fail" | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {

    setLoadingButton(true);
    
    API_CALL.registerUser(data).then(res => {
        setAlertMessage(res.data.statusMessage);
        setAlertVariant(res.data.status);
        setLoadingButton(false);
        setShowAlert(true);
    })
  }

  return (
    <Form {...form}>

      {showAlert && <CustomAlert message={alertMessage} variant={alertVariant}/>}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col justify-center">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input placeholder="User name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loadingButton && <LoadingButton/>}
        {!loadingButton && <Button type="submit">Register</Button>}
      </form>
    </Form>
  )
}
