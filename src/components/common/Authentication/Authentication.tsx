'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { currentProfileSelector } from '@/src/reduxjs/auth/selectors';
import LoadingContainer from '../LoadingContainer';

interface Props {
  children: React.ReactNode;
  isAdmin: boolean;
}

const Authentication = ({ children, isAdmin }: Props): React.ReactNode => {
  const currentProfile = useAppSelector(currentProfileSelector);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { getCurrentProfile } = useActions();

  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isProfileUnset = currentProfile !== undefined;
    if (isProfileUnset) {
      const isProfileEmpty = currentProfile === null;
      const isProfileHaveAccess = !currentProfile?.is_admin && isAdmin;
      if (isProfileEmpty) {
        return router.push('/login');
      }
      if (isProfileHaveAccess) {
        return router.push('/');
      }
      return setIsLoading(false);
    }
  }, [isAdmin, currentProfile, isLoading, router]);

  return <>{isLoading ? <LoadingContainer /> : children}</>;
};

export default Authentication;
