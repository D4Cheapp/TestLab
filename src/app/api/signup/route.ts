import {profileAuthReceiveType} from "@/src/types/receiveTypes";
import { createFetch } from "@/src/utils/createFetch";
import { authApiHadndler } from "@/src/utils/authApiHandler";
import { NextRequest } from "next/server";
import {registerInfoType, requestTypesType} from "@/src/types/requestTypes";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await Promise.resolve<registerInfoType>(req.json());
    const data = await createFetch<profileAuthReceiveType>({
      method: req.method as requestTypesType,
      href: '/signup',
      isLocal: false,
      body: reqBody,
    });
    return authApiHadndler(data);
  } catch (e) {
    return authApiHadndler(new Error("Error during proxy fetching"));
  }
}
