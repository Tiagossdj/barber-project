"use client"

import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "./ui/dialog"
import deleteBooking from "../actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isConfirmed = isFuture(booking.date)
  const {
    service: { barbershop },
  } = booking

  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      setIsSheetOpen(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar a reserva.")
    }
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%]">
        <Card className="min-w-[90%]">
          <CardContent className="flex justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-col gap-2 py-5 pl-5 text-left">
              <Badge
                variant={isConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h3 className="font-semibold">{booking.service.name}</h3>

              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={booking.service.barbershop.imageUrl} />
                </Avatar>
                <p className="text-sm">{booking.service.barbershop.name}</p>
              </div>
            </div>

            {/* DIREITA */}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%]">
        <SheetHeader>
          <SheetTitle className="border-b border-solid pb-5 text-left">
            Informações da Reserva
          </SheetTitle>
        </SheetHeader>

        <div className="relative mt-6 flex h-[180px] w-full items-end">
          <Image
            src={"/map.png"}
            fill
            className="rounded-xl object-cover"
            alt={`Mapa para barbearia ${barbershop.imageUrl}`}
          />

          <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
            <CardContent className="flex w-full items-center gap-3 px-5 py-3">
              <Avatar>
                <AvatarImage src={barbershop.imageUrl} />
              </Avatar>

              <div>
                <h3 className="font-bold">{barbershop.name}</h3>
                <p className="text-xs">{barbershop.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="my-6">
          <Badge
            variant={isConfirmed ? "default" : "secondary"}
            className="w-fit"
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>
        </div>

        <Card className="my-6">
          <CardContent className="space-y-3 p-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{booking.service.name}</h2>
              <p className="text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(booking.service.price))}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Data</h2>
              <p className="text-sm">
                {format(booking.date, "d 'de' MMMM", {
                  locale: ptBR,
                })}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Horário</h2>
              <p className="text-sm">{format(booking.date, "HH:mm")}</p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Barbearia</h2>
              <p className="text-sm">{barbershop.name}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {barbershop.phones.map((phone) => (
            <PhoneItem phone={phone} key={phone} />
          ))}
        </div>

        <SheetFooter className="mt-6">
          <div className="flex items-center gap-3">
            <SheetClose asChild>
              <Button className="w-full" variant="outline">
                Voltar
              </Button>
            </SheetClose>

            {isConfirmed && (
              <Dialog>
                <DialogTrigger>
                  <Button className="w-full" variant="destructive">
                    Cancelar Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] rounded-xl">
                  <DialogHeader className="space-y-4">
                    <DialogTitle>Deseja cancelar a reserva?</DialogTitle>
                    <DialogDescription>
                      Esta ação não pode ser desfeita. Isso irá cancelar
                      permanentemente sua reserva.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Voltar</Button>
                    </DialogClose>

                    <DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleCancelBooking}
                      >
                        Confirmar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
