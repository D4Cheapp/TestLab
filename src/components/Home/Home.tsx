'use client';
import React, { ChangeEvent, UIEvent, useCallback, useEffect, useRef, useState } from 'react';
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
  const testList = useAppSelector((state) => state.test.tests);
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const isAdmin = useAppSelector((state) => state.auth.currentProfile)?.is_admin;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryParams = useSearchParams().get('filter');
  const testListRef = useRef<HTMLDivElement>(null);

  const [isReverseDate, setIsReverseDate] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>(validateFilterValue(queryParams));
  const [testPage, setTestPage] = useState<number>(1);

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

  const onTestScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const height = e.currentTarget.offsetHeight;
      const scrollHeight = e.currentTarget.scrollHeight;

      const scrollPercentHeight = parseInt('' + (height / scrollHeight) * 100, 10);
      const isHeightApproximatelyEqual = scrollPercentHeight > 90;

      if (isHeightApproximatelyEqual) {
        setTestPage(testPage + 1);
      }
    },
    [testPage],
  );

  const setFilter = () => {
    if (filterValue) {
      const query = validateFilterValue(filterValue);
      setTestPage(1);
      router.push(`/` + (query ? `?filter=${query}` : ''));
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, isReverseDate]);

  useEffect(() => {
    const filterTimeout = setTimeout(() => setFilter(), 1500);
    return () => clearTimeout(filterTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  useEffect(() => {
    const height = testListRef.current?.clientHeight;
    const scrollHeight = testListRef.current?.scrollHeight;
    const isTestListRender = height && scrollHeight && testList.length !== 0;

    if (isTestListRender) {
      const scrollPercentHeight = parseInt('' + (height / scrollHeight) * 100, 10);
      const isHeightApproximatelyEqual = scrollPercentHeight > 90;

      if (isHeightApproximatelyEqual) {
        setTestPage(testPage + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testList]);

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
        ref={testListRef}
        onScroll={onTestScroll}
        className={clsx(
          styles.testContainer,
          { [styles.emptyContainer]: testList.length === 0 },
          { [styles.loadingContainer]: isLoading },
        )}
      >
        {isLoading ? (
          <div className={styles.loading} />
        ) : (
          testList.map((test) => (
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
