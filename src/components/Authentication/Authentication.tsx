'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getCurrentProfile } from '@/src/reduxjs/reducers/authReducer';
import styles from './Authentication.module.scss';

interface AuthenticationInterface {
  children: React.ReactNode;
  isAdmin: boolean;
}

function Authentication({ children, isAdmin }: AuthenticationInterface): React.ReactNode {
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

  return (
    <section className={clsx({ [styles.root]: isLoading })}>
      {isLoading ? <div className={styles.loading} /> : children}
    </section>
  );
}

export default Authentication;
