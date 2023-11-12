import { questionCreateType, requestTypesType } from "@/src/types/requestTypes";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createFetch } from "@/src/utils/createFetch";
import { authApiHadndler } from "@/src/utils/authApiHandler";

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookie = cookies().get('_session_id');
    const reqBody = await Promise.resolve<questionCreateType>(req.json());
    const data = await createFetch<object>({
      method: req.method as requestTypesType,
      href: `/tests/${params.id}/questions`,
      isLocal: false,
      body: reqBody,
      cookie,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error('Error during proxy fetching'));
  }
}