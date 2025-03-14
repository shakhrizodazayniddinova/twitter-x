import { IUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sliceText } from "@/lib/utils";

export const User = ({user}: {user: IUser}) => {
  return (
    <div className="flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md"> 
      <div className="flex gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={user.profileImage} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-clamp-1">{user.name}</p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {user.username ? `${sliceText(user.username, 22)}` : sliceText(user.email, 22)}
          </p>
        </div>
      </div>
    </div>
  );
}