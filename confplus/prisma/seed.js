const fs = require('fs-extra');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const datesPath = path.join(process.cwd(), 'data/conf-dates')
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
		const schedule = await fs.readJSON(schedulePath)
		const users = await fs.readJSON(usersPath)

    console.log(dates);
		console.log(institutions);
		console.log(locations);
		console.log(papers);
		console.log(schedule);
		console.log(users);

    for (const date of dates) await prisma.date.create({ data: date })
		for (const institution of institutions) await prisma.institution.create({ data: institution })
		for (const location of locations) await prisma.location.create({ data: location })
		for (const user of users) await prisma.user.create({ data: user })


    } catch (error) {
        console.log(error);
        return { error: error.message }
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