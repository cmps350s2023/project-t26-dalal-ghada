import fs from 'fs-extra';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const datesPath = path.join(process.cwd(), 'data/conf-dates.json')
const institutionsPath = path.join(process.cwd(), 'data/institutions.json')
const locationsPath = path.join(process.cwd(), 'data/locations.json')
const papersPath = path.join(process.cwd(), 'data/papers.json')
const schedulePath = path.join(process.cwd(), 'data/schedule.json')
const usersPath = path.join(process.cwd(), 'data/users.json')

async function main() {
    try {
        const dates = await fs.readJSON(datesPath)
        const institutions = await fs.readJSON(institutionsPath)
        const locations = await fs.readJSON(locationsPath)
        const papers = await fs.readJSON(papersPath)
        const schedules = await fs.readJSON(schedulePath)
        const users = await fs.readJSON(usersPath)

        //   console.log(dates);
        //	console.log(institutions);
        //	console.log(locations);
        //	console.log(papers);
        //	console.log(schedule);
        //	console.log(users);



  // Create users
  


        //create schedules
        for (const schedule of schedules) {
            await prisma.schedule.create({
              data: {
                title: schedule.title,
                location: schedule.location,
                date: schedule.date,
                presentations: {
                  create: schedule.presentations.map(presentation => ({
                    paperId: presentation.paperId,
                    startTime: presentation.startTime,
                    endTime: presentation.endTime,
                  })),
                },
              },
            });
          }
        


        // create papers
        
        for (const paper of papers) {
            console.log(paper.id);
          
            // Create authors
            const authorsData = paper.authors.map(author => ({
              id: author.id,
              firstName: author.firstName,
              lastName: author.lastName,
              email: author.email,
              affiliation: author.affiliation,
              isPresenter: author.isPresenter
            }));
          
            // Create reviewers
            reviewer:{
            const reviewersData = paper.reviewers.map(reviewerId => ({
              reviewerId: reviewerId
            }))};
            for (const paper of papers) {
                console.log(paper.id);
                await prisma.paper.create({
                  data: {
                    paperId:paper.paperId,
                    paper_title: paper.title,
                    abstract: paper.abstract,
                    paperURL: paper.paperURL,
                    isPresented: paper.isPresented,
                    
                    authors: {
                      create: paper.authors.map(author => ({
                        id: author.id,
                        firstName: author.firstName,
                        lastName: author.lastName,
                        email: author.email,
                        affiliation: author.affiliation,
                        isPresenter: author.isPresenter
                      }))
                    },
                    reviewers: {
        
                        reviewers: {
                            create: paper.reviewers.map(reviewerID => ({
                              reviewer: {
                                connect: {
                                  id: reviewerID
                                }
                              }}))}},
                            
                          
                      
                // Create reviews separately for each paper
                reviews: {
                 create: paper.reviews.map(review => ({
                    data: {
                      userID: review.userID,
                      overallRating: review.overallRating,
                      contribution: review.contribution,
                      weakness: review.weakness,
                      strength: review.strength,
                     
                    }
                  }))
                }
              
              } } )}}
            
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })