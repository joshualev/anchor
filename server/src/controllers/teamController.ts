import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// use prisma and grab data from the database
const prisma = new PrismaClient();

// Gets the tasks associated with the project id (passed through query params)
export const getTeams = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const teams = await prisma.team.findMany();

        const teamsWithUserNames = await Promise.all(
            teams.map(async (team: any) => {
                // Get the product owner user for the team
                const productOwner = await prisma.user.findUnique({
                    where: { userId: team.productOwnerUserId! },
                    select: { username: true },
                });

                // Get the project manager user for the team
                const projectManager = await prisma.user.findUnique({
                    where: { userId: team.projectManagerUserId! },
                    select: { username: true },
                });

                // return the list of teams, add the username for the product owner and project username.
                return {
                    ...team,
                    productOwnerUsername: productOwner?.username,
                    projectManagerUsername: projectManager?.username
                }
        }))

        res.json(teamsWithUserNames);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving teams: ${error.message}`});
    }
}
