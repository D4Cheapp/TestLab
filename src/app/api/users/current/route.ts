import {profileAuthReceiveType} from "@/src/types/receiveTypes";
import { createFetch } from '@/src/utils/createFetch';
import { authApiHadndler } from '@/src/utils/authApiHandler';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {requestTypesType} from "@/src/types/requestTypes";

export async function GET(req: NextRequest) {
  try {
    const cookie = cookies().get('_session_id');
    const data = await createFetch<profileAuthReceiveType>({
      method: req.method as requestTypesType,
      href: '/users/current',
      isLocal: false,
      cookie
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}
