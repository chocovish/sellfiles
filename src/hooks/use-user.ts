'use client';
import { useUserQuery, useUserProfileQuery } from './use-user-query';

// Re-export the hooks using React Query for backwards compatibility
export const useUser = () => {
  const { data: user } = useUserQuery();
  return user;
};

export const useUserProfile = () => {
  const profileQuery = useUserProfileQuery();
  // const { data: profile, isLoading } = useUserProfileQuery();
  return { ...profileQuery, userProfile: profileQuery.data };
};
