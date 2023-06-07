import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {

  //Get all items
  var papers = await prisma.paper.findMany({
	  include: {
		  authors: true,
		  reviewers: {
			  select: { reviewerId: true }
		  }
      }
  });
  
  if (req.method === 'POST') {
	  const reqPaper = req.body;
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
	  
	  const paper = {
		  paper_title: reqPaper.paper_title,
		  abstract: reqPaper.abstract,
		  file: reqPaper.file
	  };
	  
	  // create authors and connect them to the paper
	  const paperWithAuthors = await prisma.paper.create({
		  data: {
			  ...paper,
			  authors: {
				  create: reqPaper.authors
			  },
			  overall_evaluation: 2 //Review the paper
		  }
	  });
	  
	  const paperId = paperWithAuthors.id;
	  
	  await prisma.reviewersOnPapers.create({
		  data: {
			  paperId: paperId,
			  reviewerId: x
		  }
	  });
	  
	  await prisma.reviewersOnPapers.create({
		  data: {
			  paperId: paperId,
			  reviewerId: y
		  }
	  });
	  
	  res.status(201).json({ success: true });
  }
  
  if (req.method === 'GET') {
	  //Get reviewed papers with "strong accept"
	  papers = papers.filter((p) => p.overall_evaluation >= 2);
	  res.status(200).json(papers);
  }

}
