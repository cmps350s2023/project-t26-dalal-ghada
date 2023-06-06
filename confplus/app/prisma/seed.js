import fs from 'fs-extra';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const datesPath = path.join(process.cwd(), '/data/conf-dates.json');
const institutionsPath = path.join(process.cwd(), '/data/institutions.json');
const locationsPath = path.join(process.cwd(), '/data/locations.json');
const papersPath = path.join(process.cwd(), '/data/papers.json');
const schedulePath = path.join(process.cwd(), '/data/schedule.json');
const usersPath = path.join(process.cwd(), '/data/users.json');

async function main() {
  try {
    const dates = await fs.readJSON(datesPath);
    const institutions = await fs.readJSON(institutionsPath);
    const locations = await fs.readJSON(locationsPath);
    const papers = await fs.readJSON(papersPath);
    const schedules = await fs.readJSON(schedulePath);
    const users = await fs.readJSON(usersPath);

    // Create dates

    for (const date of dates) {
        await prisma.date.create({
          data: {
            name: date.name,
          },
        });
      }
  
  
    // Create institutions
    for (const institution of institutions) {
      await prisma.institution.create({
        data: {
          name: institution.name,
        },
      });
    }

    // Create locations
    for (const location of locations) {
      await prisma.location.create({
        data: {
          name: location.name,
        },
      });
    }

    // Create users
    for (const user of users) {
      await prisma.user.create({
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });
    }

    // Create papers, authors, and reviewers
    for (const paper of papers) {
      const createdPaper = await prisma.paper.create({
        data: {
          paper_title: paper.paper_title,
          abstract: paper.abstract,
          file: paper.file,
          overall_evaluation: paper.overall_evaluation,
          authors: {
            createMany: {
              data: paper.authors.map(author => ({
                first_name: author.first_name,
                last_name: author.last_name,
                email: author.email,
                affiliation: author.affiliation,
                presenter: author.presenter,
              })),
            },
          },
          reviewers: {
            createMany: {
              data: paper.reviewers.map(reviewer => ({
                reviewer: {
                  connect: { id: reviewer.reviewerId },
                },
              })),
            },
          },
        },
      });

      console.log(`Created paper with ID: ${createdPaper.id}`);
    }

    // Create schedules and presentations
    for (const schedule of schedules) {
      const createdSchedule = await prisma.schedule.create({
        data: {
          title: schedule.title,
          date: schedule.date,
          location: {
            connect: { id: schedule.locationId },
          },
          presentations: {
            createMany: {
              data: schedule.presentations.map(presentation => ({
                paper_title: presentation.paper_title,
                presenter_name: presentation.presenter_name,
                from_time: presentation.from_time,
                to_time: presentation.to_time,
              })),
            },
          },
        },
      });

      console.log(`Created schedule with ID: ${createdSchedule.id}`);
    }}   

catch (error) {
    console.log(error);
    return { error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

