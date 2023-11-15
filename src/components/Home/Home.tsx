'use client';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { HomeNavbar, TestComponent } from '@/src/components/Home/components';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { profileLogout } from '@/src/reduxjs/reducers/authReducer';
import { getPaginationTests } from '@/src/reduxjs/reducers/testReducer';
import styles from './Home.module.scss';

function validateFilterValue(filter: string | null) {
  return !!filter?.trim() ? filter.replace(/\s+/gm, ' ').trim().toLowerCase() : '';
}

function Home(): React.ReactNode {
  const tests = useAppSelector((state) => state.test.tests);
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const isAdmin = useAppSelector((state) => state.auth.currentProfile)?.is_admin;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryParams = useSearchParams().get('filter');

  const [isReverseDate, setIsReverseDate] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>(validateFilterValue(queryParams));
  const [testPage, setTestPage] = useState<number>(0);

  const onPassTestClick = useCallback(
    (index: number) => router.push(`/pass-test?id=${index}`),
    [router],
  );

  const onEditTestClick = useCallback(
    (index: number) => router.push(`/edit-test?id=${index}`),
    [router],
  );

  const onDeleteTestClick = useCallback(
    (index: number) => router.push(`/delete-test?id=${index}`),
    [router],
  );

  const onLogoutClick = useCallback(() => {
    dispatch(profileLogout());
    router.push('/login');
  }, [dispatch, router]);

  const onFilterReverseClick = useCallback(() => setIsReverseDate(!isReverseDate), [isReverseDate]);

  const onFilterInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value),
    [setFilterValue],
  );

  const setFilter = () => {
    const query = validateFilterValue(filterValue);
    setTestPage(0);
    router.push(`/` + (query ? `?filter=${query}` : ''));
  };

  const addTestClick = () => {
    router.push(`/add-test`);
  };

  useEffect(() => {
    dispatch(
      getPaginationTests({
        page: testPage,
        per: 7,
        search: queryParams ?? '',
        sort: isReverseDate ? 'created_at_asc' : 'created_at_desc',
      }),
    );
  }, [queryParams, dispatch, isReverseDate]);

  useEffect(() => {
    const filterTimeout = setTimeout(() => setFilter(), 1500);
    return () => clearTimeout(filterTimeout);
  }, [filterValue]);

  return (
    <div className={styles.home}>
      <HomeNavbar
        isReverseDate={isReverseDate}
        onFilterReverseClick={onFilterReverseClick}
        onLogoutClick={onLogoutClick}
        onFilterInput={onFilterInput}
        defaultFilterValue={filterValue}
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
          tests.map((test) => (
            <TestComponent
              key={test.id}
              title={test.title}
              testId={test.id}
              isAdmin={isAdmin}
              onDeleteTestClick={onDeleteTestClick}
              onEditTestClick={onEditTestClick}
              onPassTestClick={onPassTestClick}
            />
          ))
        )}
      </section>

      <button className={styles.addButton} onClick={addTestClick}>
        +
      </button>
    </div>
  );
}

export default Home;
