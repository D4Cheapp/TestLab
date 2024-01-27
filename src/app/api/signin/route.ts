import { NextRequest } from 'next/server';
import { ProfileAuthReceiveType } from '@/src/types/receiveTypes';
import { ProfileLoginRequestType, RequestTypesType } from '@/src/types/requestTypes';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await Promise.resolve<ProfileLoginRequestType>(req.json());
    const data = await createFetch<ProfileAuthReceiveType>({
      method: req.method as RequestTypesType,
      href: '/signin',
      isLocal: false,
      body: reqBody,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
