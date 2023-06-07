import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  //Find the absolute path of the data directory
  const jsonDirectory = path.join(process.cwd(), 'data');

  //Read the json file
  const fileContents = await fs.readFile(jsonDirectory + '/users.json', 'utf8');

  if (req.query.role === "reviewer") {
	  var users = JSON.parse(fileContents);
	  users = users.filter((u) => u.role === "reviewer");
	  return res.status(200).json(users);
  }

  //Return the content of the data file in json format as backend API
  res.status(200).json(JSON.parse(fileContents));

}
