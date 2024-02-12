import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';
import { TestReceiveType } from '@/src/types/receiveTypes';
import { CreateTestRequestType, RequestTypesType } from '@/src/types/requestTypes';

export async function GET(req: NextRequest) {
  const url = req.url;
  const isUrlIncludeParams = url.includes('?');
  let searchParams = '?';

  if (isUrlIncludeParams) {
    searchParams += url.split('?')[1];
  }

  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<TestReceiveType>({
      method: req.method as RequestTypesType,
      href: `/tests${searchParams}`,
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<CreateTestRequestType>(req.json());
    const data = await createFetch<TestReceiveType>({
      method: req.method as RequestTypesType,
      href: `/tests`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
