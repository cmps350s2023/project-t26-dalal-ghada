import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  if (req.method === 'POST') {
	  //Find the absolute path of the data directory
	  const jsonDirectory = path.join(process.cwd(), 'data');

	  //Read the json file
	  const fileContents = await fs.readFile(jsonDirectory + '/users.json', 'utf8');
	  
	  const users = JSON.parse(fileContents);
	  const email = req.body.email;
	  const password = req.body.password;
	  const user = users.find((u) => u.email === email);
	  if (!user) {
		  return res.status(404).send('User not found');
	  }
	  if (user.password != password) {
		  return res.status(401).send('Password Invalid!');
	  }
	  /*switch (user.role) {
		  case "author": res.redirect('/submit-paper.html');break;
		  case "reviewer": res.redirect('/review-paper.html');break;
		  case "organizer": res.redirect('/schedule-editor.html');break;
	  }*/
	  res.status(200).json({ first_name: user.first_name, role: user.role })
  }

}