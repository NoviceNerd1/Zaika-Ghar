// utils/cookieConfig.ts
type CookieConfig = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  domain?: string;
  maxAge?: number;
};

export const getCookieConfig = (withExpiry = true): CookieConfig => {
  const baseConfig: CookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".vercel.app",
    path: "/",
    //domain: isProduction ? "zaika-ghar.onrender.com" : undefined,
  };

  if (withExpiry) {
    baseConfig.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  return baseConfig;
};
