import { NextRequest } from 'next/server';
import { profileAuthReceiveType } from '@/src/types/receiveTypes';
import { profileLoginRequestType, requestTypesType } from '@/src/types/requestTypes';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await Promise.resolve<profileLoginRequestType>(req.json());
    const data = await createFetch<profileAuthReceiveType>({
      method: req.method as requestTypesType,
      href: '/signin',
      isLocal: false,
      body: reqBody,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
