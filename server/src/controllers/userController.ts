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

/**
 * Retrieves a single user from the database using their Cognito ID
 * 
 * @description
 * This endpoint connects AWS Cognito authentication with our application's user data.
 * It takes a Cognito ID from the request parameters and queries the database
 * to find the corresponding user profile.
 */
export const getUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { cognitoId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                cognitoId: cognitoId
            }
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving user: ${error.message}`});
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
