import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  const locations = await prisma.location.findMany();

  //Return the locations in json format as backend API
  res.status(200).json(locations);

}
