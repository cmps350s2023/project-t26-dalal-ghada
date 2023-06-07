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
        for (const user of users) {
            await prisma.user.create({
              data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                role: user.role,
                papers: {
                  create: user.papers,
                },
              },
            }).catch(e => {
              console.log('create user error ===', e);
            });
          }
        
        


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

            for (const paper of papers) {
                console.log(paper.id);
                await prisma.paper.create({
                    data: {
                        paperId: paper.paperId,
                        paper_title: paper.title,
                        abstract: paper.abstract,
                        paperURL: paper.paperURL,
                        isPresented: paper.isPresented,
                        paperId: paper.id
                    }
                })
            }

            // Create authors
            const authorsData = paper.authors.map((author) => ({
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                email: author.email,
                affiliation: author.affiliation,
                isPresenter: author.isPresenter
            }));

            for (let index = 0; index < authorsData.length; index++) {
                const element = authorsData[index];
                await prisma.author.create({
                    data: {
                        // id: element.id,
                        firstName: element.firstName,
                        lastName: element.lastName,
                        email: element.email,
                        affiliation: element.affiliation,
                        isPresenter: element.isPresenter,
                        paperId: paper.id
                    }
                })
            }

            // create reviews
            const reviewsData = paper.reviews.map(review => ({
                userID: review.userID,
                overallRating: review.overallRating,
                contribution: review.contribution,
                weakness: review.weakness,
                strength: review.strength,

            }))

            for (let index = 0; index < reviewsData.length; index++) {
                const element = reviewsData[index];
                await prisma.review.create({
                    data: {
                        userID: element.userID,
                        overallRating: element.overallRating,
                        contribution: element.contribution,
                        weakness: element.weakness,
                        strength: element.strength,
                    }
                })
            }

            // Create reviewers
            const reviewersData = paper.reviewers.map(reviewerId => ({
                reviewerId: reviewerId
            }))

            console.log('reviewersData ===', reviewersData)

            for (let index = 0; index < reviewersData.length; index++) {
                const element = reviewersData[index];
                await prisma.reviewer.create({
                    data: {
                        paperId: paper.id,
                        reviewerId: element.reviewerId,
                    }
                })
            }
        }

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