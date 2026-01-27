import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"
import { HomeIcon, CalendarIcon, LogOutIcon } from "lucide-react"
import { quickSearchOption } from "../_constants/search"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

const Sidebar = () => {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center gap-3 border-b border-solid py-5">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlc3NvYXxlbnwwfHwwfHx8MA%3D%3D" />
        </Avatar>

        <div>
          <p className="font-bold">Amanda Rocha</p>
          <p className="text-xs">amandarocha@fullstack.io</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href={"/"}>
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        <Button className="justify-start gap-2" variant="ghost">
          <CalendarIcon />
          Agendamento
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOption.map((option) => (
          <Button
            key={option.title}
            className="justify-start gap-2"
            variant="ghost"
          >
            <Image
              src={option.imageUrl}
              width={18}
              height={18}
              alt={option.title}
            />
            {option.title}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2 py-5">
        <Button className="justify-start" variant="ghost">
          <LogOutIcon />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default Sidebar
