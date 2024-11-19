import { ReactNode } from "react";

export default async function LayoutLogin ({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen">
            {children}
        </div>
    )
}