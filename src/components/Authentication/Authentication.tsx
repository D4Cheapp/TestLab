'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getCurrentProfile } from '@/src/reduxjs/reducers/testReducer';
import styles from './Authentication.module.scss';

interface AuthenticationInterface {
  children: React.ReactNode;
  isAdmin: boolean;
}

function Authentication({ children, isAdmin }: AuthenticationInterface): React.ReactNode {
  const currentProfile = useAppSelector((state) => state.test.currentProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentProfile !== undefined) {
      if (currentProfile === null) {
        return router.push('/login');
      }

      if (!currentProfile?.is_admin && isAdmin) {
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
