import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { profileLogoutReceiveType } from '@/src/types/receiveTypes';
import { requestTypesType } from '@/src/types/requestTypes';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';

export async function DELETE(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<profileLogoutReceiveType>({
      method: req.method as requestTypesType,
      href: '/logout',
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
