import { deleteRecieveType, testReceiveType } from "@/src/types/receiveTypes";
import { requestTypesType } from "@/src/types/requestTypes";
import { createFetch } from '@/src/utils/createFetch';
import { authApiHadndler } from '@/src/utils/authApiHandler';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<deleteRecieveType>({
      method: req.method as requestTypesType,
      href: `/tests/${params.id}`,
      isLocal: false,
      cookie
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<testReceiveType>({
      method: req.method as requestTypesType,
      href: `/tests/${params.id}`,
      isLocal: false,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<{ title: string }>(req.json());
    const data = await createFetch<testReceiveType>({
      method: req.method as requestTypesType,
      href: `/tests/${params.id}`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}

