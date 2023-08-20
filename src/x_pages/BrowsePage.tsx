import { CardPost } from '@/x_components/CardPost'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react'
import API_CALL from '@/x_utils/api'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreateNewPostForm } from '@/x_components/CreateNewPostForm'
import { CustomToast } from '@/x_components/CustomToast'


export function SkeletonDemo() {
  return (
    <div className="flex flex-col gap-5 mt-10 md:space-x-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
          <Skeleton className="h-4 md:w-[150px] w-[50px] bg-gray-200" />
        </div>
        <Skeleton className="h-4 md:w-[250px] w-[100px] bg-gray-200" />
        <Skeleton className="h-4 md:w-[200px] w-[75px] bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 md:w-[400px] w-[300px] bg-gray-200" />
        <Skeleton className="h-6 md:w-[400px] w-[300px] bg-gray-200" />
        <Skeleton className="h-6 md:w-[400px] w-[300px] bg-gray-200" />
      </div>
    </div>
  )
}

const BrowsePage = () => {

  const [posts, setPosts] = useState<[any]>();
  const [loadingSkeleton, setLoadingSkeleton] = useState<boolean>(true);
  const [showCreatePostForm, setShowCreatePostForm] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastVariant, setToastVariant] = useState<"fail" | "success">();

  const showToastAndToggleIt = (variant: "fail" | "success", message: string) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }
      
  useEffect(() => {
      API_CALL.getPosts().then(res => {
          setPosts(res.data);
          setLoadingSkeleton(false);
      })
  }, [])

  return (
    
    <div className="container mt-5 flex justify-center overflow-y-auto ... no-scrollbar" style={{ height: "85vh" }}>
      <div className="flex flex-col gap-5">
       {showToast && <CustomToast description={toastMessage} variant={toastVariant}/>}
        {loadingSkeleton ? 
        <>
          <SkeletonDemo/>
          <SkeletonDemo/>
          <SkeletonDemo/>
        </>
        :
        <div className="flex flex-col gap-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" onClick={() => setShowCreatePostForm(true)} className="bg-blue-500 border-blue-400 text-white mb-2 ">Create new post</Button>
              </AlertDialogTrigger>
              {showCreatePostForm && <CreateNewPostForm posts={posts} setPosts={setPosts}/>}
            </AlertDialog>
          
          {posts?.map(post => <CardPost key={post?.id} post={post} posts={posts} setPosts={setPosts} showToastAndToggleIt={showToastAndToggleIt}/>)}
        </div>
        }

        
      </div>
    </div>
  )
}

export default BrowsePage