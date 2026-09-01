import { jwtDecode } from 'jwt-decode';

export function isTokenValid (token: string) {
  // exp is defined as the number of seconds since the epoch
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  /* token is considered valid when its expiry is at least
  5 seconds further from the epoch than the current time */
  return decoded.exp > currentTime + 5;
}

interface getTokenProps {
  refresh: () => Promise<string>
  logout: () => Promise<void>
}

export default async function syncToken ({ refresh, logout }: getTokenProps) {
  let accessToken = localStorage.getItem('auth-token');
  /* Since the local storage is at the mercy of the user and their browser,
  isAuthenticated does not guarantee there being an access token. */
  if (!accessToken) {
    await logout();
    return;
  } else {
    if (!isTokenValid(accessToken)) {
      try {
        accessToken = await refresh();
        // .refresh() throws if the refresh token has expired
      } catch {
        await logout();
        return;
      }
    }

    return accessToken;
  }
}
