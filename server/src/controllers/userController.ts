import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Retrieves all users from the database.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};


/**
 * Retrieves a specific user by their Cognito ID.
 * 
 * @description
 * This endpoint is typically called after Cognito authentication to fetch application-specific user data.
 * The flow is:
 * 1. User authenticates with Cognito
 * 2. Frontend receives Cognito tokens
 * 3. Frontend calls this endpoint with the cognitoId
 * 4. Application receives user-specific data
 * 
 * @param req.params.cognitoId - The Cognito user ID from AWS Cognito user pool
 * @returns User object if found, null if not found
 * 
 * @security This endpoint should be protected with authentication middleware
 * @throws 500 if database operation fails
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId: cognitoId,
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};


/**
 * Creates a new user record in the application database.
 * 
 * @description
 * This endpoint is designed to work with AWS Cognito Post-Confirmation Lambda trigger.
 * When a user completes signup/confirmation in Cognito, a Lambda function should call
 * this endpoint to create the corresponding user record in the application database.
 * 
 * Example Lambda trigger:
 * ```javascript
 * exports.handler = async (event) => {
 *     const cognitoId = event.request.userAttributes.sub;
 *     const username = event.request.userAttributes.email;
 *     await fetch('your-api-url/users', {
 *         method: 'POST',
 *         body: JSON.stringify({ cognitoId, username })
 *     });
 *     return event;
 * };
 * ```
 * 
 * @param req.body.username - User's username
 * @param req.body.cognitoId - Cognito user ID from AWS Cognito user pool
 * @param req.body.profilePictureUrl - Optional profile picture URL (defaults to "i1.jpg")
 * @param req.body.teamId - Optional team ID (defaults to 1)
 * @returns Created user object with success message
 * 
 * @security This endpoint should be protected and only callable by trusted services
 * @throws 500 if database operation fails
 */
export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;
    const newUser = await prisma.user.create({
      data: {
        username,
        cognitoId,
        profilePictureUrl,
        teamId,
      },
    });
    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};