import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import defaultAvatar from "../assets/default_avatar.jpg"
import { ClipLoader } from "react-spinners";
import { timeAgo } from "@/x_utils/timeAgo";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { getUserLoggedData } from "@/x_utils/auth";
import API_CALL from "@/x_utils/api";
import { useNavigate } from "react-router-dom";
import { encrypt } from "@/x_utils/crypto";

export function CardPost({ post, posts, setPosts, showToastAndToggleIt } : {post: any, posts?: any | undefined, setPosts?: any | undefined, showToastAndToggleIt?: any | undefined}) {

  const navigate = useNavigate();

  const deletePost = (id: string) => {
    API_CALL.deletePost(id).then((res) => {

      if(res.data.status === "success"){
        const newPosts = [...posts];
        setPosts(newPosts.filter(newPost => newPost.id !== post.id));
        showToastAndToggleIt("success", res.data.statusMessage);
      }
    })
  }

  return (
    <Card className="w-[300px] md:w-[550px] h-[350px] flex flex-col justify-between gap-3 relative">
        <div>
      <CardHeader>
        <div className="flex items-center justify-between px-3 mb-3">
            <div className="flex items-center justify-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${encrypt(post?.postedBy?.id)}`)}>
                 <Avatar>
                    <AvatarImage alt="Profile" loading="lazy" src={post?.postedBy?.profilePicture ? `https://sabin2001.blob.core.windows.net/profilepics/${post?.postedBy?.profilePicture}` : defaultAvatar}/>
                    <AvatarFallback>
                        <ClipLoader
                            color={"primary"}
                            loading={true}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-gray-700 font-semibold"><span className="font-bold text-blue-800">@ </span>{post?.postedBy?.name}</h2>
            </div>
            <span className="text-gray-500">{timeAgo(post?.postedAt)}</span>
        </div>

        {post?.postedBy?.id === getUserLoggedData()?.id &&
          <Menubar className="absolute -top-1 right-1">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer"><BiDotsHorizontalRounded className="text-blue-500 text-2xl"/></MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="w-[100px]" onClick={() => deletePost(post?.id)}>
                  Delete post
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        }
        <p className="text-2xl font-semibold leading-none tracking-tight">{post?.title}</p>
        <CardDescription>[post tags]</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="break-words ..." style={{whiteSpace: "pre-line"}}>
            {post?.description}
        </p>
      </CardContent>
      </div>
      <CardFooter className="border-t flex items-center justify-center pt-5">
        <Button variant="outline">Comments</Button>
      </CardFooter>
    </Card>
  )
}