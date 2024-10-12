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
