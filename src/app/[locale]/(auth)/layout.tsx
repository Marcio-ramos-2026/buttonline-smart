import { queryUsers } from "@/lib/db";
import { ReactNode } from "react";

export default async function LayoutLogin ({ children }: { children: ReactNode }) {
    const users = await queryUsers()
    return (
        <div className="h-screen">
            {children}
        </div>
    )
}