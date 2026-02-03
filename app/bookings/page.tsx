import { getServerSession } from "next-auth"
import Header from "../_components/header"
import authOptions from "../_lib/auth"
import { notFound } from "next/navigation"
import BookingItem from "../_components/booking-item"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluded-bookings"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return notFound()
  }

  const confirmedBooking = getConfirmedBookings()

  const concludedBooking = getConcludedBookings()

  return (
    <>
      <Header />

      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        {(await confirmedBooking).length === 0 &&
          (await concludedBooking).length === 0 && (
            <p className="text-gray-400">Você não possui agendamentos.</p>
          )}

        {(await confirmedBooking).length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            {(await confirmedBooking).map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}

        {(await concludedBooking).length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            {(await concludedBooking).map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
