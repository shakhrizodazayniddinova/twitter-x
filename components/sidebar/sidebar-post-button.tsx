import { Feather } from "lucide-react"
import Link from "next/link"

export const SidebarPostButton = () => {
  return (
    <Link href={"/"}>
        {/* MOBILE POST */}
        <div className='mt-6 rounded-full h-14 w-14 flex items-center justify-center bg-sky-500 hover:bg-opacity-80 transition cursor-pointer lg:hidden'>
            <Feather size={24} color='white' />
        </div>

        {/* DESKTOP POST */}
        <div className="mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer">
            <p className="hidden lg:block text-center font-semibold text-white text-[20px]">
                POST
            </p>
        </div>
    </Link>
  )
}
