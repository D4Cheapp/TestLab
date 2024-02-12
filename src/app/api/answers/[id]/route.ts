import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { DeleteReceiveType } from '@/src/types/receiveTypes';
import { CreateAnswerRequestType, RequestTypesType } from '@/src/types/requestTypes';

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<DeleteReceiveType>({
      method: req.method as RequestTypesType,
      href: `/answers/${params.id}`,
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<CreateAnswerRequestType>(req.json());
    const data = await createFetch<object>({
      method: req.method as RequestTypesType,
      href: `/answers/${params.id}`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
