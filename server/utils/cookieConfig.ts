// utils/cookieConfig.ts
export const getCookieConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
    // Remove domain or set it properly based on your actual domain
    // domain: isProduction ? ".yourdomain.com" : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};
