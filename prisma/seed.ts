import { prisma } from '@/lib/prisma';
import { Permissions } from '@/lib/types';

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
        console.log('result', permission, result);
        permissionsData.push({ id: result.id }); // Collect in { id: <id> } format for connect
    }

    // DEFAULT ROLES
    for (const role of getDefaultRoles()) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: {
                name: role.name,
                description: role.description,
            },
            create: {
                id: role.id,
                name: role.name,
                permissions: {
                    connect: permissionsData, // Connect permissions by ID
                },
            },
        });
    }
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
