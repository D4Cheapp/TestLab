import { questionCreateType, requestTypesType } from "@/src/types/requestTypes";
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { createFetch } from '@/src/utils/createFetch';
import { authApiHadndler } from '@/src/utils/authApiHandler';

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<questionCreateType>({
      method: req.method as requestTypesType,
      href: `/questions/${params.id}`,
      isLocal: false,
      cookie
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<questionCreateType>(req.json());
    const data = await createFetch<object>({
      method: req.method as requestTypesType,
      href: `/questions/${params.id}`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}