export interface OAuthProvider {
  getAuthUrl(state: string): string;
  getToken(code: string): Promise<string>;
  getProfile(accessToken: string): Promise<OAuthProfile>;
}

interface OAuthProfile {
  id: string;
  email: string | null;
}
