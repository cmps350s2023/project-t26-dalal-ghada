import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  const institutions = await prisma.institution.findMany();

  //Return the institutions in json format as backend API
  res.status(200).json(institutions);

}
