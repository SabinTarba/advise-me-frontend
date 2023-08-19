import { Button } from '@/components/ui/button';
import { isUserLoggedIn } from '@/x_utils/auth';
import { CgProfile } from "react-icons/cg"
import { Link } from "react-router-dom";
import { useState } from 'react';

export function SideMenu({ closeSideBar } : { closeSideBar: () => void}) {
  
    const isUserLogged = isUserLoggedIn();

    const [menuTab, setMenuTab] = useState<string | null>(localStorage.getItem("menuTab"));


    return (
      <div className="pb-12 border-r w-25">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              <span className="text-blue-600">Menu</span>
            </h2>
            <div className="space-y-1 flex flex-col justify-between">
              <div>
                <Link to={"/browse"} onClick={() => { closeSideBar(); setMenuTab("1"); localStorage.setItem("menuTab", "1") }}> 
                  <Button className={`w-full mb-3 bg-white text-dark justify-start hover:bg-blue-800 hover:text-white ${menuTab === "1" ? "bg-blue-700 text-white" : "" }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    Browse
                  </Button>
                </Link>
                <Link to={"/profile"} onClick={() => { closeSideBar(); setMenuTab("2"); localStorage.setItem("menuTab", "2") }}>
                  <Button className={`w-full mb-3 bg-white text-dark justify-start hover:bg-blue-800 hover:text-white ${menuTab === "2" ? "bg-blue-700 text-white" : "" }`}>
                    <CgProfile className="mr-2 h-4 w-4"/>
                    Profile
                  </Button>
                </Link> 
              </div>
            </div>

              {isUserLogged && <Button className="w-full" variant="default" onClick={() => {localStorage.clear(); window.location.replace("/");}}>Log Out</Button>}
            </div>
          </div>
        </div>
    )
  }