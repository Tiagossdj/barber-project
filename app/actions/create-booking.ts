"use server"

import { db } from "../_lib/prisma"

interface CreateBookingParams {
  userId: string
  serviceId: string
  date: Date
}

const createBooking = async (params: CreateBookingParams) => {
  await db.booking.create({
    data: params,
  })
}

export default createBooking
