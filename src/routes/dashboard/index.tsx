import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

import { LoaderSkeleton } from "@/components/dashboard/loader-skeletone";
import PurchaseDashboard from "@/components/dashboard/purchase-dashbaord";
import SalesDashboard from "@/components/dashboard/sales-dashboard";
import { useUserProfile } from "@/hooks/use-user";

function DashboardPage() {
    const {userProfile, isLoading} = useUserProfile();
    if (isLoading) {
        return <LoaderSkeleton />
    }

    if (userProfile?.userType === "buyer") {
        return <PurchaseDashboard />
    } else if (userProfile?.userType === "seller") {
        return <SalesDashboard />
    } else {
        return <div>Unauthorized</div>
    }
}