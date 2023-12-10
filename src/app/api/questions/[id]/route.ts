import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createQuestionRequestType, requestTypesType } from '@/src/types/requestTypes';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHandler } from '@/src/utils/authApiHandler';

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<createQuestionRequestType>({
      method: req.method as requestTypesType,
      href: `/questions/${params.id}`,
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
    const reqBody = await Promise.resolve<createQuestionRequestType>(req.json());
    const data = await createFetch<object>({
      method: req.method as requestTypesType,
      href: `/questions/${params.id}`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}