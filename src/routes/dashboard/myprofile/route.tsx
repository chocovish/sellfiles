import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/myprofile')({
  component: MyProfileLayout,
})

import { ProfileSidebar } from "@/components/profile-sidebar";
import { PathNameProvider } from "./-layout-client";
import { useUserProfile } from '~/hooks/use-user';


function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile } = useUserProfile();
  const isSeller = userProfile?.userType === "seller";

  return (
    <PathNameProvider>
      <main className="container mx-auto px-4 py-8">
        
        <div className={`flex ${isSeller ? 'flex-col md:flex-row' : 'flex-col' } gap-8`}>
          {/* Only show sidebar for sellers */}
          {isSeller && <ProfileSidebar />}
          <div className={`flex-1 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm md:p-6 border border-blue-100 ${isSeller ? '' : 'max-w-4xl mx-auto w-full'}`}>
            <Outlet />
          </div>
        </div>
      </main>
    </PathNameProvider>
  );
} 