import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getUserLoggedData, isUserLoggedIn } from './x_utils/auth';
import logo from './assets/logo.png';
import defaultAvatar from './assets/default_avatar.jpg';
import { Toaster } from './components/ui/toaster';
import { RegisterForm } from './x_components/RegisterForm';
import { SideMenu } from './x_components/SideMenu';
import { LogInForm } from "./x_components/LogInForm";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Routes, Route } from "react-router-dom";
import BrowsePage from "./x_pages/BrowsePage";
import ProfilePage from "./x_pages/ProfilePage";
import { ClipLoader } from "react-spinners";
import { AiOutlineMenu } from "react-icons/ai";

function App() {

  const isUserLogged = isUserLoggedIn();

  const [userName, setUserName] = useState(getUserLoggedData()?.name);
  const [profilePicture, setProfilePicture] = useState(getUserLoggedData()?.profilePicture);

  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  const closeSideBar = () => {
      setShowSideBar(false);
  }

  return (
    <div>
      <Toaster/>

      <div className="border-b p-3">
        <div className="flex h-17 items-center md:mx-[150px] justify-mx-auto">
          {isUserLogged && <AiOutlineMenu className="md:absolute md:left-5 text-3xl cursor-pointer" onClick={() => setShowSideBar(!showSideBar)}/> }

          <div className="ml-auto flex items-center space-x-2">
            {!isUserLogged && 
            <>
              <span className="text-gray-500">Already have an Account?</span> 
              <AlertDialog>
                <AlertDialogTrigger className="p-2 bg-blue-700 rounded text-white">Log In</AlertDialogTrigger>
                <AlertDialogContent className="w-80">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log In</AlertDialogTitle>
                      <LogInForm />
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <span className="text-gray-500">or</span>
              <AlertDialog>
                <AlertDialogTrigger className="p-2 bg-gray-700 rounded text-white">Sign Up</AlertDialogTrigger>
                <AlertDialogContent className="w-80">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Up</AlertDialogTitle>
                      <RegisterForm/>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </>
            }

            {isUserLogged &&
              <div className="flex gap-4 items-center">
                <h1 className="text-blue-500 font-bold">{userName}</h1>
                <Avatar>
                  <AvatarImage alt="Profile" loading="lazy" src={profilePicture ? `https://sabin2001.blob.core.windows.net/profilepics/${profilePicture}` : defaultAvatar}/>
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
              </div>    
            }
          </div>
        </div>
      </div>

      {isUserLogged ? 
        <div className="flex">
            {showSideBar && <SideMenu closeSideBar={closeSideBar}/>}
            <Routes>
                <Route path="*" index element={<BrowsePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/profile" element={<ProfilePage setUserName={setUserName} setProfilePicture={setProfilePicture}/>} />
            </Routes>
        </div>

        :
        <div className="flex justify-center mt-[100px]">
          <div className="flex flex-col gap-5">
            <img src={logo} alt='logo img'/>
            <div className="text-gray-500 text-center text-xl">
              Connect, talk, post, share and <strong className="text-blue-600 underline">advise</strong>
              
            </div>
          </div>
        </div>
      }

    </div>
  );
}

export default App;
