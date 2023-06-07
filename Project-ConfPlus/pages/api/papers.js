import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  //Find the absolute path of the data directory
  const jsonDirectory = path.join(process.cwd(), 'data');

  //Find the absolute path of the papers file
  const jsonFile = jsonDirectory + '/papers.json';

  //Read the json file
  const fileContents = await fs.readFile(jsonFile, 'utf8');
  var papers = JSON.parse(fileContents);
  
  if (req.method === 'POST') {
	  const paper = req.body;
	  const newId = papers.length + 1;
	  let x,y;

	  await fetch('http://127.0.0.1:3000/api/users?role=reviewer')
      .then((res) => res.json())
      .then((data) => {
		  let r = Math.random() * data.length;
		  const i = parseInt(r);
		  if (i-1<0) {
			  y = data[i+1].id;
		  } else {
			  y = data[i-1].id;
			}
			x = data[i].id;
	  });

	  var ids = [];
	  ids.push(x);
	  ids.push(y);
	  const evaluation = 2; //Review the paper
	  const newPaper = { id: newId, ...paper, reviewers: ids, overall_evaluation: evaluation };
	  papers.push(newPaper);
	  
	  //Write data to the json file
	  await fs.writeFile(jsonFile, JSON.stringify(papers));
	  res.status(201).json({ success: true });
  }
  
  if (req.method === 'GET') {
	  //Get reviewed papers with "strong accept"
	  papers = papers.filter((p) => p.overall_evaluation >= 2);
	  res.status(200).json(papers);
  }

}
