import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  const sessions = await prisma.session.findMany({
	  include: {
		  presentations: true
      }
  });

  if (req.method === 'POST') {
	  const newSchedule = req.body;
	  
	  if (sessions != null && sessions.length != 0)
		await prisma.session.deleteMany();
	  
	  for (const reqSession of newSchedule.sessions) {
		  const session = {
			  title: reqSession.title,
			  location: reqSession.location,
			  date: reqSession.date
		  };
		  
		  // create presentations and connect them to the session
		  const sessionWithPresentations = await prisma.session.create({
			  data: {
				...session,
				presentations: {
				  create: reqSession.presentations
				}
			  }
		  });
	  }
	  
	  if (sessions != null && sessions.length != 0)
		res.status(200).json({ message: 'Updated' });
	  else
		res.status(201).json({ message: 'Created' });
  }

  if (req.method === 'GET') {
	  res.status(200).json({ sessions: sessions });
  }

}
