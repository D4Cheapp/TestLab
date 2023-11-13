import { createAnswerReciveType } from '@/src/types/receiveTypes';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createFetch } from '@/src/utils/createFetch';
import { authApiHadndler } from '@/src/utils/authApiHandler';
import { createAnswerRequestType, requestTypesType } from '@/src/types/requestTypes';

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<createAnswerRequestType>(req.json());
    const data = await createFetch<createAnswerReciveType>({
      method: req.method as requestTypesType,
      href: `/questions/${params.id}/answers`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}