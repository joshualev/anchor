import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Initialize Prisma client
const prisma = new PrismaClient();

// Function to delete all existing data before seeding
async function deleteAllData(orderedFileNames: string[]) {
  // Convert file names to model names (e.g., "user.json" -> "User")
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  // Delete data from each model in reverse order
  // This ensures that dependent data is deleted before its dependencies
  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  // Set the directory where seed data files are stored
  const dataDirectory = path.join(__dirname, "seedData");

  // Define the order of seeding
  // This order is crucial as some data depends on the existence of other data
  // For example, projectTeam depends on both team and project existing first
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  // Clear existing data before seeding
  await deleteAllData(orderedFileNames);

  // Seed data for each model in the specified order
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      // Create each entity in the JSON file
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

// Run the main function
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
