export const ADMIN_ACCESS_PERMISSION = 'IS_ADMIN'
export const ADMIN_PERMISSION: Record<string, string[]> = {
    '/admin/users': ['ADMIN_USER'],
    '/admin/clients': ['ADMIN_CLIENTS']
}