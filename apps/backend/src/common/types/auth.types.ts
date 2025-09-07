
export interface UserInfo {
  id: string;
  full_name?: string;
  user_type: string;
  email?: string;
}

export interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
  domain?: string;
}
