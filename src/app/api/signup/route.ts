import { profileAuthReceiveType } from '@/src/types/receiveTypes';
import { profileRegisterRequestType, requestTypesType } from '@/src/types/requestTypes';
import { authApiHadndler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await Promise.resolve<profileRegisterRequestType>(req.json());
    const data = await createFetch<profileAuthReceiveType>({
      method: req.method as requestTypesType,
      href: '/signup',
      isLocal: false,
      body: reqBody,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}
