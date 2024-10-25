import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// use prisma and grab data from the database
const prisma = new PrismaClient();

// Gets the tasks associated with the project id (passed through query params)
export const getUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving users: ${error.message}`});
    }
}


// Create user profile and insert into our database
export const postUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            username,
            cognitoId,
            profilePictureUrl = "i1.jpg",
            teamId = 1
        } = req.body;
        const newUser = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId
            }
        });
        res.json({ message: "User Created Successfully", newUser });
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving users: ${error.message}`});
    }
}
