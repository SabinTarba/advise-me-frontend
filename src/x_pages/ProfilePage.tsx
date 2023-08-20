import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { getUserLoggedData, saveUserLoggedData } from '@/x_utils/auth'
import API_CALL from '@/x_utils/api'
import { Label } from "@/components/ui/label"
import { Dispatch, useState } from "react"
import { CustomToast } from "@/x_components/CustomToast"
import { LoadingButton } from "@/x_components/LoadingButton"
import { encrypt } from "@/x_utils/crypto"
import defaultAvatar from "../assets/default_avatar.jpg"
import { ClipLoader } from "react-spinners";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const DefaultAvatarSection = () => {
  return (
    <div>
      <p>You don't have a profile picture!</p>
      <img width={150} height={150} className="rounded-full" src={defaultAvatar} alt="Avatar"/>
    </div>
)
}

export default function ProfilePage({ setUserName, setProfilePicture } : {setUserName: Dispatch<any>, setProfilePicture: Dispatch<any>}) {

  const userInfo = getUserLoggedData();

  const [file, setFile] = useState<any>(null);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastVariant, setToastVariant] = useState<"success" | "fail">();

  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState<boolean>(userInfo?.profilePicture !== null  && userInfo?.profilePicture !== undefined);

  const FormSchema = z.object({
    id: z.string().optional().default(userInfo?.id)
      ,
    name: z.string().min(3, {
      message: "User name must be at least 3 characters.",
    }).default(userInfo?.name),
    email: z.string().email({
      message: "Email format is incorrect.",
    }).default(userInfo?.email),
    description: z.string().max(150, {
      message: "Bio must be maximum of 150 characters.",
    }).optional().default(userInfo?.description),
    url1: z.string().max(150, {
      message: "Url 1 must be maximum of 150 characters.",
    }).optional().default(userInfo?.url1),
    url2: z.string().max(150, {
      message: "Url 2 must be maximum of 150 characters.",
    }).optional().default(userInfo?.url2),
    password: z.string().optional().default(userInfo?.password),
    age: z.string().min(1, {
      message: "Age must be completed."
    }).default(String(userInfo?.age)),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: any) {
    setLoadingButton(true);

    data.profilePicture = file ? file.name : userInfo.profilePicture;

    if(file){
      setLoadingProfilePicture(true);
    }

    API_CALL.uploadImage(file).then(uploaded => {
        API_CALL.updateUser(data).then(res => {
          if(res.data.status === "success"){
            setToastVariant(res.data.status);
            setToastMessage(res.data.statusMessage);
            setShowToast(true);
            setLoadingButton(false);
            
            setUserName(res.data.savedUser.name);
            setProfilePicture(res.data.savedUser.profilePicture);

            saveUserLoggedData(encrypt(JSON.stringify(res.data.savedUser)));

            setLoadingProfilePicture(false);
          }
        })
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setFile(files?.[0]);
  };

  const handleRemoveProfilePicture = () =>{
    API_CALL.removeProfilePicture().then(res => {
      setToastVariant(res.data.status);
      setToastMessage(res.data.statusMessage);
      setShowToast(true);

      const loggedUser = getUserLoggedData();
      setProfilePicture(null);
      loggedUser.profilePicture = null;

      saveUserLoggedData(encrypt(JSON.stringify(loggedUser)));
    })
  }

  return (
    <div className="container mt-10 flex justify-center">
      {showToast && <CustomToast description={toastMessage} variant={toastVariant}/>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full flex flex-col">
          <div className="md:flex-row flex-col flex justify-center">
            <div className="md:w-1/2 mr-20">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account id</FormLabel>
                    <FormControl>
                      <Input disabled defaultValue={userInfo?.id} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your account id. In case you have problem, you'll open a ticket and you'll specify account id for best support.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User name</FormLabel>
                    <FormControl>
                      <Input defaultValue={userInfo?.name} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name or a
                      pseudonym.
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
                      <Input defaultValue={userInfo?.email} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-1/2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" defaultValue={userInfo?.age} {...field} />
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
                      <Textarea defaultValue={userInfo?.description} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL 1</FormLabel>
                    <FormControl>
                      <Input defaultValue={userInfo?.url1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL 2</FormLabel>
                    <FormControl>
                      <Input defaultValue={userInfo?.url2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                          
            </div>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm items-center gap-4">
              
            <img className="hidden" onLoad={() => setLoadingProfilePicture(false)} key={"img_profile_picture_key2"} alt="Profile" src={`https://sabin2001.blob.core.windows.net/profilepics/${getUserLoggedData()?.profilePicture}`}/>

              {userInfo?.profilePicture && !loadingProfilePicture ? <img key={"img_profile_picture_key"} width={150} height={150} className="rounded-full justify-center" alt="Profile" src={`https://sabin2001.blob.core.windows.net/profilepics/${getUserLoggedData()?.profilePicture}`}/>
               : !userInfo?.profilePicture && <Label htmlFor="picture"><DefaultAvatarSection/></Label>}

              <ClipLoader 
                  color={"primary"}
                  loading={loadingProfilePicture}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
               />

              <Label htmlFor="picture">Picture</Label>

              <div className="flex gap-5 mb-10">
                  <Input onChange={handleFileChange} id="picture" type="file" />
                  
                  {userInfo?.profilePicture && 
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" className="bg-red-600 text-xs text-white border border-red-600 hover:bg-red-500">Remove picture</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            profile picture, but you'll can upload another one anytime you want.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                          <AlertDialogAction type="button" onClick={() => handleRemoveProfilePicture() }>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  }
              </div>
            </div>
          </div>
          {loadingButton && <LoadingButton className="w-[100px] md:w-[250px] absolute top-[60px] right-5 md:relative"/>}
          {!loadingButton && <Button type="submit" className="w-[100px] md:w-[250px] absolute top-[60px] right-5 md:relative">Update profile</Button>}
        </form>
      </Form>
    </div>
  )
}

