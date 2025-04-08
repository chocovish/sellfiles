import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from "@/components/header/header";

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})


function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <Outlet />
        </div>
    )
}
