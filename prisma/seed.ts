import { prisma } from '@/lib/prisma';
import { Permissions } from '@/lib/types';
import bcrypt from 'bcrypt'

function getDefaultRoles() {
    return [
        { id: 1, name: 'Administrator', description: 'ROLE_ADMINISTRATOR' },
        { id: 2, name: 'User', description: 'ROLE_USER' },
    ];
}

async function main() {
    const permissionsData = [];

    // SYSTEM PERMISSIONS
    for (const permission of Object.keys(Permissions)) {
        const result = await prisma.permission.upsert({
            where: { name: permission },
            update: {},
            create: {
                name: permission,
                description: permission,
            },
        });
        
        permissionsData.push({ id: result.id }); // Collect in { id: <id> } format for connect
    }

    // DEFAULT ROLES
    for (const role of getDefaultRoles()) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: {
                name: role.name,
                description: role.description,
                permissions: {
                    deleteMany: {}, // Clear existing permissions to avoid duplication
                    create: permissionsData.map((perm) => ({
                        permission: { connect: { id: perm.id } },
                    })),
                },
            },
            create: {
                id: role.id,
                name: role.name,
                description: role.description,
                permissions: {
                    create: permissionsData.map((perm) => ({
                        permission: { connect: { id: perm.id } },
                    })),
                },
            },
        });
    }

    const admin_pass = await bcrypt.hash(process.env.ADMIN_PASSWORD as string,10)

    await prisma.user.upsert({
        where: {
            id: 'cm3z1i66f000008ldeyof858q'
        },
        update: {
            password: admin_pass
        },
        create: {
            id: 'cm3z1i66f000008ldeyof858q',
            email: "cardenas@cardenas.com.br",
            roleId: 1, //admin,
            emailVerified: new Date(),
            name: "Administrador Cardenas",
            password: admin_pass,
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
