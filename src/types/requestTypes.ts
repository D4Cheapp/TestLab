export type requestTypesType = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type loginInfoType = { username: string; password: string };
export type registerInfoType = loginInfoType & { password_confirmation: string; is_admin: boolean };
export type signinType = loginInfoType;