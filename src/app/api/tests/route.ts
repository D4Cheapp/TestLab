import { testReceiveType } from '@/src/types/receiveTypes';
import { createTestRequestType, requestTypesType } from '@/src/types/requestTypes';
import { authApiHadndler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.url;
  let searchParams = '?';
  if (url.includes('?')) {
    searchParams += url.split('?')[1];
  }

  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<testReceiveType>({
      method: req.method as requestTypesType,
      href: `/tests${searchParams}`,
      isLocal: false,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<createTestRequestType>(req.json());
    const data = await createFetch<testReceiveType>({
      method: req.method as requestTypesType,
      href: `/tests`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}