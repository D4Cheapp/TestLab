import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createQuestionRequestType, requestTypesType } from '@/src/types/requestTypes';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<createQuestionRequestType>(req.json());
    const data = await createFetch<object>({
      method: req.method as requestTypesType,
      href: `/tests/${params.id}/questions`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
