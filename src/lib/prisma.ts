import { PrismaClient } from "@prisma/client"
import {createSoftDeleteExtension} from 'prisma-extension-soft-delete' 

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
const prismaOriginal = globalForPrisma.prisma || new PrismaClient()

export const prisma = prismaOriginal.$extends(
    createSoftDeleteExtension({
        models: {
            User: {
                field: "deletedAt",
                createValue: (deleted) => {
                    if (deleted) return new Date();
                    return null;
                },
            }
        }
    })
) as PrismaClient
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma