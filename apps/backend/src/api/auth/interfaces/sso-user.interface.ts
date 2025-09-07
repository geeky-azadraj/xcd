export interface SSOUser {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  provider: string;
  provider_id: string;
}

export interface SSOProfile {
  id: string;
  emails: Array<{ value: string; verified?: boolean }>;
  displayName: string;
  photos?: Array<{ value: string }>;
  provider: string;
}

export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  name: string;
  provider: string;
  iat?: number;
  exp?: number;
}
