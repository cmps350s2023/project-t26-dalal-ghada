import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  const dates = await prisma.date.findMany();

  //Return the dates in json format as backend API
  res.status(200).json(dates);

}
