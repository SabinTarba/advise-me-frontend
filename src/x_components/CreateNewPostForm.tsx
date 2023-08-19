import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRef, useState } from "react"
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
import { Progress } from "@/components/ui/progress"
import { CustomToast } from "./CustomToast"
import { getUserLoggedData } from "@/x_utils/auth"
import { Textarea } from "@/components/ui/textarea"


const FormSchema = z.object({
  title: z.string().max(100, {
    message: "Post title should be less than 150 characters",
  }),
  description: z.string().max(500, {
    message: "Password must be less than 500 characters.",
  })
})

export function CreateNewPostForm({ posts, setPosts } : {posts: any, setPosts: any}) {

  const [progress, setProgress] = useState<number>(33);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastVariant, setToastVariant] =useState<"fail" | "success">();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const actionButtonRef: any = useRef();

  function onSubmit(data: z.infer<typeof FormSchema>) {

    const title = data.title;
    const description = data.description;

    setShowProgress(true);

    setTimeout(() => {

      setProgress(63);

      API_CALL.createPost(data).then(res => {

        setProgress(100);
  
        setTimeout(() => {
          setToastMessage(res.data.statusMessage);
          setToastVariant(res.data.status);
          setShowToast(true);

          if(res.data.status === "success") {

            const post = {
              title: title,
              description: description,
              postedBy: getUserLoggedData(),
              postedAt: new Date().toISOString(),
              id: res.data.id
            }

            const newPosts = [...posts];
            newPosts.unshift(post);
            setPosts(newPosts);

            handleCloseModal();
          }
        }, 1000);
      }
      )
    }, 1000);
    
  }

  const handleCloseModal = () => {
    form.reset();
    setShowProgress(false);
    actionButtonRef.current.click();

    setTimeout(() => {
      setShowToast(false);
      setProgress(33);
    }, 3000)
  }

  return (
      <AlertDialogContent className="w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>Create new post</AlertDialogTitle>
          <AlertDialogDescription>
          {showToast && <CustomToast description={toastMessage} variant={toastVariant}/>}

            {showProgress && 
              <div className="flex items-center gap-3 justify-center mb-3">
                <div>
                  Posting ...
                </div>
                <Progress value={progress} className="w-[80%]" />
              </div>
            }
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col justify-center">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <Button disabled={showProgress} type="submit" className="bg-blue-700 hover:bg-blue-400">Create post</Button>
            </form>   
          </Form>
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="hidden"><input ref={actionButtonRef}/> hidden</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
  )
}