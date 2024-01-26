'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getCurrentProfile } from '@/src/reduxjs/reducers/authReducer';
import { LoadingContainer } from '../LoadingContainer';

interface Props {
  children: React.ReactNode;
  isAdmin: boolean;
}

function Authentication({ children, isAdmin }: Props): React.ReactNode {
  const currentProfile = useAppSelector((state) => state.auth.currentProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  useEffect(() => {
    const isProfileUnset = currentProfile !== undefined;

    if (isProfileUnset) {
      const isProfileEmpty = currentProfile === null;
      if (isProfileEmpty) {
        return router.push('/login');
      }

      const isProfileHaveAccess = !currentProfile?.is_admin && isAdmin;
      if (isProfileHaveAccess) {
        return router.push('/');
      }

      return setIsLoading(false);
    }
  }, [isAdmin, currentProfile, isLoading, router]);

  return <>{isLoading ? <LoadingContainer /> : children}</>;
}

export default Authentication;
