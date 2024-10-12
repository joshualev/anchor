import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// use prisma and grab data from the database
const prisma = new PrismaClient();

// Gets the tasks associated with the project id (passed through query params)
export const getTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    // pass project id from frontend, to use to get associated tasks with that project id.
    const { projectId } = req.query
    try {
        const tasks = await prisma.task.findMany({
            where : {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving tasks: ${error.message}`});
    }
}


export const updateTaskStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    // pass project id from frontend, to use to get associated tasks with that project id.
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = await prisma.task.update({
           where: {
            id: Number(taskId),
           },
           data: {
            status: status,
           }
        })
        
        res.json(updatedTask);
    } catch (error: any) {
        res.status(500).json({ message: `Error updating task: ${error.message}`});
    }
}



// Create a new project from the information retrieved from the frontend
export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { 
        title,
        description,
        status, 
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId
     } = req.body;
    try {
        const newTask = await prisma.task.create({
            data: { 
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId 
            },
        })
        res.status(201).json(newTask);
    } catch (error: any) {
        res.status(500).json({ message: `Error creating task: ${error.message}`});
    }
}


// Gets the tasks associated with a specific user
export const getUserTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.params
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { authorUserId: Number(userId) },
                    { assignedUserId: Number(userId) }
                ]
            },
            include: {
                author: true,
                assignee: true,
            },
        });
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving users tasks: ${error.message}`});
    }
}
