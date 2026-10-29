const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env, set it, then restart with: npx expo start -c',
  );
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
  apiPrefix: '/api/v1', // every backend endpoint lives under this prefix
  requestTimeoutMs: 65_000, // free hosting can take about a minute to wake up
} as const;
