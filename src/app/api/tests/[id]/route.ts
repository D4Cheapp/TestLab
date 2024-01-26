import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { DeleteReceiveType, TestReceiveType } from '@/src/types/receiveTypes';
import { RequestTypesType } from '@/src/types/requestTypes';
import { authApiHandler } from '@/src/utils/authApiHandler';
import { createFetch } from '@/src/utils/createFetch';

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<DeleteReceiveType>({
      method: req.method as RequestTypesType,
      href: `/tests/${params.id}`,
      isLocal: false,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<TestReceiveType>({
      method: req.method as RequestTypesType,
      href: `/tests/${params.id}`,
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
    const reqBody = await Promise.resolve<{ title: string }>(req.json());
    const data = await createFetch<TestReceiveType>({
      method: req.method as RequestTypesType,
      href: `/tests/${params.id}`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHandler(data);
  } catch (e) {
    return authApiHandler(new Error('Error during proxy fetching'));
  }
}
