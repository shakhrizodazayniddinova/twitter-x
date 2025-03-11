import { IUser } from "@/types";
import { signOut } from "next-auth/react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
    user: IUser;
}

export const SidebarAccount = ({user}: Props) => {
  return <>
    {/* MOBILE SIDEBAR ACCOUNT */}
    <div className="lg:hidden block">
        <div className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer"
          onClick={() => signOut()}
        >
          <RiLogoutCircleLine size={24} color="white" />
        </div>
    </div>

    {/* DESKTOP SIDEBAR ACCOUNT */}
    <Popover>
        <PopoverTrigger className="w-full rounded-full hover:bg-slate-300 hidden lg:block cursor-pointer hover:bg-opacity-10 px-4 py-2 transition">
            <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-start text-white">
                        <p className="truncate w-40">{user?.name}</p>
                        {user?.username ? (
                            <p className="opacity-40">{user?.username}</p>
                        ) : (
                            <p className="opacity-40">Manage account</p>
                        )}
                    </div>
                </div>
                <MoreHorizontal size={24} color="white" />
            </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black border-none rounded-2xl shadow shadow-white px-0 mb-3">
            <div className="font-bold text-white cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 px-4 py-1 transition"
              onClick={() => signOut()}>
                Log out {user?.username ? `${user?.username}` : user?.name}
            </div>
        </PopoverContent>
    </Popover>
  </>
}
