import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  //Find the absolute path of the data directory
  const jsonDirectory = path.join(process.cwd(), 'data');

  //Find the absolute path of the papers file
  const jsonFile = jsonDirectory + '/schedule.json';

  //Read the json file
  const fileContents = await fs.readFile(jsonFile, 'utf8');
  const schedule = JSON.parse(fileContents);

  if (req.method === 'POST') {
	  const newSchedule = req.body;
	  await fs.writeFile(jsonFile, JSON.stringify(newSchedule));
	  if (schedule.sessions != null && schedule.sessions.length != 0)
		res.status(200).json({ message: 'Updated' });
	  else
		res.status(201).json({ message: 'Created' });
  }

  if (req.method === 'GET') {
	res.status(200).json(schedule);
  }

}
