/**
 * A list of all possible permissions
 */
export enum ALLOWED_PERMISSIONS {
    IS_ADMIN = 'IS_ADMIN',
    EDITOR_VIEW = "EDITOR_VIEW",
    ADMIN_USERS = 'ADMIN_USERS',
    ADMIN_USER_CREATE = 'ADMIN_USER_CREATE',
    ADMIN_USER_EDIT = 'ADMIN_USER_EDIT',
    ADMIN_USER_DELETE = 'ADMIN_USER_DELETE',
    ADMIN_CLIENTS = 'ADMIN_CLIENTS',
    ADMIN_CLIENTS_CREATE = 'ADMIN_CLIENTS_CREATE',
    ADMIN_CLIENTS_EDIT = 'ADMIN_CLIENTS_EDIT',
    ADMIN_CLIENTS_DELETE = 'ADMIN_CLIENTS_DELETE',
}

/**
 * Permission key that allows users to access the `/admin` route.
 */
export const ADMIN_ACCESS_PERMISSION = 'IS_ADMIN';

/**
 * A mapping of routes to their required permissions.
 * 
 * Each route can be accessed by one or more permissions. Use this object 
 * to define which permissions are needed for specific routes.
 * 
 * Example:
 * - `/admin/users` requires the `ADMIN_USERS` permission.
 * - `/admin/clients` requires the `ADMIN_CLIENTS` permission.
 */
export const ROUTE_PERMISSION: Record<string, string[]> = {
    '/admin/users': [ALLOWED_PERMISSIONS.ADMIN_USERS],
    '/admin/clients': [ALLOWED_PERMISSIONS.ADMIN_CLIENTS],
};