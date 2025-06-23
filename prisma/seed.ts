import { prisma } from '@/lib/prisma';
import { ALLOWED_PERMISSIONS } from '@/lib/permissions';
import bcrypt from 'bcrypt'

function getDefaultRoles() {
    return [
        { id: 1, name: 'Administrator', description: 'ROLE_ADMINISTRATOR' },
        { id: 2, name: 'User', description: 'ROLE_USER', permissions: [
            ALLOWED_PERMISSIONS.EDITOR_VIEW
        ] },
    ];
}

async function main() {
    const permissionsData = [];

    // SYSTEM PERMISSIONS
    for (const permission of Object.keys(ALLOWED_PERMISSIONS)) {
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
        const rolePermissions = role.permissions
            ? role.permissions.map((permName) => ({
                permission: { connect: { name: permName } },
            }))
            : permissionsData.map((perm) => ({
                permission: { connect: { id: perm.id } },
            }));

        await prisma.role.upsert({
            where: { id: role.id },
            update: {
                name: role.name,
                description: role.description,
                permissions: {
                    deleteMany: {}, // Clean up existing permissions
                    create: rolePermissions,
                },
            },
            create: {
                id: role.id,
                name: role.name,
                description: role.description,
                permissions: {
                    create: rolePermissions,
                },
            },
        });
    }

    const admin_pass = await bcrypt.hash(process.env.ADMIN_PASSWORD as string,10)

    await prisma.user.upsert({
        where: {
            id: 1
        },
        update: {
            password: admin_pass
        },
        create: {
            id: 1,
            email: "cardenas@cardenas.com.br",
            roleId: 1, //admin,
            emailVerified: new Date(),
            name: "Administrador Cardenas",
            password: admin_pass,
        },
    })

    await prisma.user.upsert({
        where: {
            id: 1001
        },
        update: {
            password: admin_pass
        },
        create: {
            id: 1001,
            email: "teste@cardenas.com.br",
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
