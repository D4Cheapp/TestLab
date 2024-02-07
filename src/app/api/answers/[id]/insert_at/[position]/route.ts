import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { RequestTypesType } from '@/src/types/requestTypes';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: number; position: number } },
) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<object>({
      method: req.method as RequestTypesType,
      href: `/answers/${params.id}/insert_at/${params.position}`,
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
