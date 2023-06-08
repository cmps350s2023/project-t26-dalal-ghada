import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  if (req.method === 'POST') {
	  const email = req.body.email;
	  const password = req.body.password;
	  
	  const user = await prisma.user.findUnique({
		  where: {
			  email: email
		  }
	  })
	  
	  if (!user) {
		  return res.status(404).send('User not found');
	  }
	  if (user.password != password) {
		  return res.status(401).send('Password Invalid!');
	  }
	  
	  res.status(200).json({ name: user.first_name, role: user.role })
  }

}
