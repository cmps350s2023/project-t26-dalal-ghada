import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  var users = await prisma.user.findMany();

  if (req.query.role === "reviewer") {
	  users = users.filter((u) => u.role === "reviewer");
	  return res.status(200).json(users);
  }

  //Return the users in json format as backend API
  res.status(200).json(users);

}
