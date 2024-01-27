'use client';
import React, {
  ChangeEvent,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { testListSelector, testMetaSelector } from '@/src/reduxjs/test/selectors';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';
import { currentProfileSelector } from '@/src/reduxjs/auth/selectors';
import s from './Home.module.scss';
import TestComponent from './components/TestComponent';
import HomeNavbar from './components/HomeNavbar';

function validateFilterValue(filter: string | null) {
  return !!filter?.trim() ? filter.replace(/\s+/gm, ' ').trim().toLowerCase() : '';
}

function Home(): React.ReactNode {
  const testList = useAppSelector(testListSelector);
  const testMeta = useAppSelector(testMetaSelector);
  const isLoading = useAppSelector(loadingStateSelector);
  const isAdmin = useAppSelector(currentProfileSelector)?.is_admin;

  const router = useRouter();
  const queryParams = useSearchParams().get('filter');
  const testListRef = useRef<HTMLDivElement>(null);
  const { profileLogout, getPaginationTests } = useActions();

  const [isLogoutWindowActive, setIsLogoutWindowActive] = useState<boolean>(false);
  const [testPage, setTestPage] = useState<number>(1);
  const [isReverseDate, setIsReverseDate] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>(
    validateFilterValue(queryParams),
  );

  const onPassTestConfirmClick = useCallback(
    (index: number) => {
      router.push(`/pass-test?id=${index}`);
    },
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
    setIsLogoutWindowActive(true);
  }, []);

  const onLogoutConfirmClick = useCallback(() => {
    profileLogout();
    router.push('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const onFilterReverseClick = useCallback(() => {
    setTestPage(1);
    setIsReverseDate(!isReverseDate);
  }, [isReverseDate]);

  const onFilterInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value),
    [setFilterValue],
  );

  const onTestScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const scrollHeight = e.currentTarget.scrollHeight;
      const scrollTop = e.currentTarget.scrollTop;
      const offsetHeight = e.currentTarget.offsetHeight;

      const isPaddingState = scrollHeight - (scrollTop + offsetHeight) < 20 && !isLoading;
      const isPaddingReady =
        isPaddingState && !!testMeta.total_pages && testPage < testMeta.total_pages;

      if (isPaddingReady) {
        setTestPage(testPage + 1);
      }
    },
    [isLoading, testMeta.total_pages, testPage],
  );

  const setFilter = () => {
    if (filterValue) {
      const query = validateFilterValue(filterValue);
      setTestPage(1);
      router.push('/' + (query ? `?filter=${query}` : ''));
    } else {
      router.push('/');
    }
  };

  const addTestClick = () => {
    router.push(`/add-test`);
  };

  useEffect(() => {
    getPaginationTests({
      page: testPage,
      per: 7,
      search: queryParams ?? '',
      sort: isReverseDate ? 'created_at_asc' : 'created_at_desc',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, isReverseDate, testPage]);

  useEffect(() => {
    const filterTimeout = setTimeout(() => setFilter(), 1500);
    return () => clearTimeout(filterTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  useEffect(() => {
    if (testListRef.current) {
      const scrollHeight = testListRef.current.scrollHeight;
      const scrollTop = testListRef.current.scrollTop;
      const offsetHeight = testListRef.current.offsetHeight;
      const isPaddingState =
        scrollHeight - (scrollTop + offsetHeight) < 20 &&
        !isLoading &&
        testMeta.total_count !== testList.length &&
        testList.length !== 0;

      if (isPaddingState) {
        setTestPage(testPage + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testList]);

  useEffect(() => {
    const scrollHeight = testListRef.current?.scrollHeight;
    const isReadyToScroll = testPage > 1 && scrollHeight && !isLoading;

    if (isReadyToScroll) {
      testListRef.current.scrollTop =
        scrollHeight -
        (scrollHeight / testList.length) * 7 -
        testListRef.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testList]);

  return (
    <div className={s.home}>
      <HomeNavbar
        isReverseDate={isReverseDate}
        isLogoutWindowActive={isLogoutWindowActive}
        setLogoutWindowActive={setIsLogoutWindowActive}
        onFilterReverseClick={onFilterReverseClick}
        onLogoutClick={onLogoutClick}
        onLogoutConfirmClick={onLogoutConfirmClick}
        onFilterInput={onFilterInput}
        defaultFilterValue={filterValue}
      />

      <section
        ref={testListRef}
        onScroll={onTestScroll}
        className={classNames(
          s.testContainer,
          { [s.emptyContainer]: testList.length === 0 },
          { [s.loadingContainer]: isLoading && testList.length === 0 },
        )}
      >
        {isLoading && !testList && <div className={s.loading} />}

        {testList.length === 0 && !isLoading ? (
          <div className={s.errorTitleContainer}>
            <h1 className={s.notFoundTitle}>Тесты не найдены</h1>
          </div>
        ) : (
          <>
            {testList.map((test) => (
              <TestComponent
                key={test.id}
                title={test.title}
                testId={test.id}
                isAdmin={isAdmin}
                onDeleteTestClick={onDeleteTestClick}
                onEditTestClick={onEditTestClick}
                onPassTestConfirmClick={onPassTestConfirmClick}
              />
            ))}

            {isLoading && (
              <div className={s.paginationLoadingContainer}>
                <div className={s.paginationLoading} />
              </div>
            )}
          </>
        )}
      </section>

      {isAdmin && (
        <button className={s.addButton} onClick={addTestClick}>
          +
        </button>
      )}
    </div>
  );
}

export default Home;