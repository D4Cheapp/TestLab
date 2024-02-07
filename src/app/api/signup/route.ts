import { NextRequest } from 'next/server';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';
import { ProfileAuthReceiveType } from '@/src/types/receiveTypes';
import { ProfileRegisterRequestType, RequestTypesType } from '@/src/types/requestTypes';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await Promise.resolve<ProfileRegisterRequestType>(req.json());
    const data = await createFetch<ProfileAuthReceiveType>({
      method: req.method as RequestTypesType,
      href: '/signup',
      isLocal: false,
      body: reqBody,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
