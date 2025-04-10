import { createFileRoute } from '@tanstack/react-router';
import { ProfileForm } from "@/components/profile-form";

export const Route = createFileRoute('/dashboard/myprofile/')({
  component: MyProfile,
})


function MyProfile() {
  return <ProfileForm />;
}