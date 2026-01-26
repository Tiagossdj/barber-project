import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

// TODO: recever agendamento como prop
const BookingItem = () => {
  return (
    <>
      <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
        Agendamentos
      </h2>
      <Card>
        <CardContent className="flex justify-between p-0">
          {/* ESQUERDA */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo</h3>

            <div className="flex items-center">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src="https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png" />
              </Avatar>
              <p className="text-sm">Barbearia FSW barber</p>
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="text sm">Agosto</p>
            <p className="text-2xl">05</p>
            <p className="text-sm">10:59</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
