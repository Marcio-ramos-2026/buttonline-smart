import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {ROUTE_PERMISSION, ADMIN_ACCESS_PERMISSION} from '@/lib/permissions'
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request,salt:'authjs.session-token',secret: process.env.AUTH_SECRET as string})

    if(request.nextUrl.pathname.startsWith('/admin')){
        if(!token) return NextResponse.redirect(new URL("/login", request.url));

        // Retrieve permissions, default to an empty array if not found
        const pathPermissions = ROUTE_PERMISSION[request.nextUrl.pathname] || [];
        const permissions = [...pathPermissions,ADMIN_ACCESS_PERMISSION];

        
        const hasAdminPermission = token.permissions.includes(ADMIN_ACCESS_PERMISSION); // IS_ADMIN is mandatory
        if (!hasAdminPermission) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        const hasOtherPermissions = permissions.find((requiredPermission) =>{
          return token.permissions.includes(requiredPermission)
        });
      
        if (!hasOtherPermissions) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
    }
    
    return null
}
