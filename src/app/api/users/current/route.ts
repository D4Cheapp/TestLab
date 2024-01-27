import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { ProfileAuthReceiveType } from '@/src/types/receiveTypes';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { RequestTypesType } from '@/src/types/requestTypes';

export async function GET(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<ProfileAuthReceiveType>({
      method: req.method as RequestTypesType,
      href: '/users/current',
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
