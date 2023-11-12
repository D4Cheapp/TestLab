import * as querystring from 'querystring';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

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
  let serverHref: string = (isLocal ? '/api' : 'https://interns-test-fe.snp.agency/api/v1') + href;

  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      Cookie: cookie ? `${cookie.name}=${cookie.value}` : 'null',
      Accept: 'application/json',
      'scope-key': 'P)uN)W6y9CbjK#;9',
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    if (method === 'GET' && isLocal) {
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

export {createFetch};
