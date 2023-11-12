import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const authApiHadndler = (data: [object, Response] | Error) => {
  if (!(data instanceof Error) && data[1].ok) {
    const cookie = data[1].headers.get('Set-Cookie');

    if (cookie) {
      const cookieValue = cookie.split(';')[0].split('=')[1];
      cookies().set('_session_id', cookieValue);
    }

    return NextResponse.json(data[0], {
      status: 200,
    });
  }
  return NextResponse.json(data instanceof Error ? { error: data.message } : data[0], {
    status: 500,
  });
};
