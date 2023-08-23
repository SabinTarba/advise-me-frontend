import { Label } from '@/components/ui/label';
import API_CALL from '@/x_utils/api';
import { decrypt } from '@/x_utils/crypto'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import defaultAvatar from "../assets/default_avatar.jpg"
import { AiOutlineArrowLeft, AiOutlineLink } from 'react-icons/ai';
import { CardPost } from '@/x_components/CardPost';
import { CustomToast } from '@/x_components/CustomToast';
import { Button } from '@/components/ui/button';
import { getUserLoggedData } from '@/x_utils/auth';

const DefaultAvatarSection = () => {
    return (
      <div>
        <img width={150} height={150} className="rounded-full" src={defaultAvatar} alt="Avatar"/>
      </div>
  )
  }


const UserProfile = () => {

  const { encryptedUserId } = useParams();
  const userId = decrypt(encryptedUserId as string);

  const [user, setUser] = useState<any>();
  const [posts, setPosts] = useState<[any]>();
  const [loadingProfilePicture, setLoadingProfilePicture] = useState<boolean>(true);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastVariant, setToastVariant] = useState<"fail" | "success">();

  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const showToastAndToggleIt = (variant: "fail" | "success", message: string) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }


  useEffect(() => {
    API_CALL.getUserById(userId).then((res) => {
        setLoadingProfilePicture(res.data.user.profilePicture !== undefined && res.data.user.profilePicture !== null);
        setUser(res.data.user);
        setLoadingUser(false);
    })

    API_CALL.getPostsByUserId(userId).then((res) => {
        setPosts(res.data);
    })
  }, [userId])


  return (
    <div className="w-screen flex justify-center" style={{height: "90vh"}}>
        <div className="w-full mt-5 relative">
            <div className="mt-5">
                {showToast && <CustomToast description={toastMessage} variant={toastVariant}/>}

                <div className='flex gap-5 h-1/4 items-center justify-center'>
                    <Link to="/browse"><AiOutlineArrowLeft className="text-2xl absolute top-0 left-5 md:relative md:-left-10"/></Link>
                    <img className="hidden" onLoad={() => setLoadingProfilePicture(false)} key={"img_profile_picture_key2"} alt="Profile" src={`https://sabin2001.blob.core.windows.net/profilepics/${user?.profilePicture}`}/>
                    {user?.profilePicture && !loadingProfilePicture ? <img key={"img_profile_picture_key"} height={150} className="rounded-full w-[100px] md:w-[120px]" alt="Profile" src={`https://sabin2001.blob.core.windows.net/profilepics/${user?.profilePicture}`}/>
                    : !user?.profilePicture && !loadingProfilePicture && <Label htmlFor="picture"><DefaultAvatarSection/></Label>}

                    <ClipLoader
                        color={"primary"}
                        loading={loadingProfilePicture}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-2xl">{user?.name}</span>
                        <span className="text-blue-600 text-sm md:text-base flex gap-1 hover:underline">{user?.url1 && <AiOutlineLink/>}<a rel="noreferrer" target="_blank" href={user?.url1}>{user?.url1}</a></span>
                        <span className="text-blue-600 text-sm md:text-base flex gap-1 hover:underline">{user?.url2 && <AiOutlineLink/>}<a rel="noreferrer" target="_blank" href={user?.url2}>{user?.url2}</a></span>
                        <div className="flex gap-5 items-center">
                            {!loadingUser && <span className="text-gray-800">{user?.totalPosts === 0 ? "No posts" : user?.totalPosts === 1 ? "1 post" : `${user?.totalPosts} posts`}</span>}
                            {getUserLoggedData()?.id === userId && <Link to={"/profile"} onClick={() => localStorage.setItem("menuTab", "2")}><Button variant="outline">Edit profile</Button></Link>}
                        </div>
                    </div>
                    
                </div>
                <div className="flex justify-center mt-5">
                    <div className="p-2 text-gray-500 md:w-[500px] text-center">
                        {user?.description}
                    </div>
                </div>
            </div>
            {user?.totalPosts !== 0 && user && <p className="text-center mt-5">Posts</p>}
            <div className='mt-4 flex h-1/4 justify-center'>
                <div className="flex flex-col gap-5">
                    {posts?.map(post => <CardPost key={post?.id} post={post} posts={posts} setPosts={setPosts} showToastAndToggleIt={showToastAndToggleIt}/>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile