import PurchasesPage from "@/components/dashboard/myprofile/purchases";

export default function PurchaseDashboard() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Purchase Dashboard</h1>
            <PurchasesPage />
        </main>
    )
}