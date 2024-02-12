import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';
import { ProfileLogoutReceiveType } from '@/src/types/receiveTypes';
import { RequestTypesType } from '@/src/types/requestTypes';

export async function DELETE(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<ProfileLogoutReceiveType>({
      method: req.method as RequestTypesType,
      href: '/logout',
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
