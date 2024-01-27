import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { CreateAnswerReceiveType } from '@/src/types/receiveTypes';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { CreateAnswerRequestType, RequestTypesType } from '@/src/types/requestTypes';

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<CreateAnswerRequestType>(req.json());
    const data = await createFetch<CreateAnswerReceiveType>({
      method: req.method as RequestTypesType,
      href: `/questions/${params.id}/answers`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
