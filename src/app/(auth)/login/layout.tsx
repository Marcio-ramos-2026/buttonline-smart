import { ReactNode } from "react";

export default function LayoutLogin ({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen">
            {children}
        </div>
    )
}