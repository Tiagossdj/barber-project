"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import createBooking from "../actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { addDays, isPast, isToday, set } from "date-fns"
import getBookings from "../actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import { SignInDialog } from "./sign-in-dialog"
import BookingSummary from "./booking-sumary"
import { useRouter } from "next/router"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

interface GetTimeListProps {
  booking: Booking[]
  selectDay: Date
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const getTimeList = ({ booking, selectDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), {
        hours: hour,
        minutes: minutes,
      }),
    )

    if (timeIsOnThePast && isToday(selectDay)) {
      return false
    }

    const hasBookOnCurrentTime = booking.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    )

    if (hasBookOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [singInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const router = useRouter()

  const { data } = useSession()

  const [selectDay, setSelectDay] = useState<Date | undefined>(undefined)
  const [selectTime, setSelectTime] = useState<string | undefined>(undefined)
  const [dayBooking, setDayBooking] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setbookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectDay) return
      const bookings = await getBookings({
        date: selectDay,
        serviceId: service.id,
      })
      setDayBooking(bookings)
    }
    fetch()
  }, [selectDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectDay || !selectTime) return
    return set(selectDay, {
      hours: Number(selectTime?.split(":")[0]),
      minutes: Number(selectTime?.split(":")[1]),
    })
  }, [selectDay, selectTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setbookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectTime(time)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectDay(undefined)
    setSelectTime(undefined)
    setDayBooking([])
    setbookingSheetIsOpen(false)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return

      await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver Agendamentos",
          onClick: () => {
            router.push("/bookings")
          },
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar agendamento.")
    }
  }

  const timeList = useMemo(() => {
    if (!selectDay) return []
    return getTimeList({
      booking: dayBooking,
      selectDay,
    })
  }, [dayBooking, selectDay])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              className="rounded-lg object-cover"
              fill
              alt={service.name}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="ml-40"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectDay}
                      onSelect={handleDateSelect}
                      disabled={{ before: addDays(new Date(), 0) }}
                      className="w-full"
                      styles={{
                        months: {
                          width: "100%",
                        },
                        month: {
                          width: "100%",
                        },
                        table: {
                          width: "100%",
                          maxWidth: "100%",
                        },
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          Nenhum horário disponível neste dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDate && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        selectedDate={selectedDate}
                        service={service}
                      />
                    </div>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <SheetClose asChild>
                      <Button
                        type="submit"
                        onClick={handleCreateBooking}
                        disabled={!selectDay || !selectTime}
                      >
                        Confirmar
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={singInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
