'use client';
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { HomeNavbar, TestComponent } from '@/src/components/Home/components';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { profileLogout } from '@/src/reduxjs/reducers/authReducer';
import { getPaginationTests } from '@/src/reduxjs/reducers/testReducer';
import styles from './Home.module.scss';

function Home(): React.ReactNode {
  const [isReverseDate, setIsReverseDate] = useState(false);
  const tests = useAppSelector((state) => state.test.tests);
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addTestClick = () => {};

  const onLogoutClick = useCallback(() => {
    dispatch(profileLogout());
    router.push('/login');
  }, [dispatch, router]);

  const onFilterReverseClick = useCallback(() => {
    setIsReverseDate(!isReverseDate);
  }, [isReverseDate]);

  useEffect(() => {
    dispatch(
      getPaginationTests({
        page: 0,
        per: 17,
        search: '',
        sort: isReverseDate ? 'created_at_asc' : 'created_at_desc',
      }),
    );
  }, [dispatch, isReverseDate]);

  return (
    <div className={styles.home}>
      <HomeNavbar
        isReverseDate={isReverseDate}
        onFilterReverseClick={onFilterReverseClick}
        onLogoutClick={onLogoutClick}
      />

      <section
        className={clsx(
          styles.testContainer,
          { [styles.emptyContainer]: tests.length === 0 },
          { [styles.loadingContainer]: isLoading },
        )}
      >
        {isLoading ? (
          <div className={styles.loading} />
        ) : (
          tests.map((test) => <TestComponent key={test.id} title={test.title} />)
        )}
      </section>

      <button className={styles.addButton} onClick={addTestClick}>
        +
      </button>
    </div>
  );
}

export default Home;
