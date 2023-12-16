import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import * as querystring from 'querystring';

type createFetchPropsType = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  href: string;
  body?: object;
  cookie?: RequestCookie;
  isLocal?: boolean;
};

const createFetch = async <T>({
  method,
  href,
  body,
  cookie,
  isLocal = true,
}: createFetchPropsType): Promise<[T, Response] | Error> => {
  let serverHref: string = (isLocal ? '/api' : process.env.SERVER_URL) + href;
  const isGetFetch = method === 'GET' && isLocal;
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      Cookie: cookie ? `${cookie.name}=${cookie.value}` : 'null',
      Accept: 'application/json',
      'scope-key': process.env.SCOPE_KEY ?? '',
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    if (isGetFetch) {
      // @ts-ignore
      serverHref += `?${querystring.stringify(body)}`;
    } else {
      init.body = JSON.stringify(body);
    }
  }

  return await fetch(serverHref, init)
    .then((response: Response) => Promise.all([response.json(), response]))
    .catch((error: Error) => error);
};

export { createFetch };
