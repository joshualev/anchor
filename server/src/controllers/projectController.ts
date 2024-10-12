import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// use prisma and grab data from the database
const prisma = new PrismaClient();

export const getProjects = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving projects: ${error.message}`});
    }
}

// Create a new project from the information retrieved from the frontend
export const createProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, description, startDate, dueDate } = req.body;
    try {
        const newProject = await prisma.project.create({
            data: { 
                name, 
                description, 
                startDate, 
                dueDate 
            },
        })
        res.status(201).json(newProject);
    } catch (error: any) {
        res.status(500).json({ message: `Error creating project: ${error.message}`});
    }
}