import { createCookie } from "react-router";

export const sessionCookie = createCookie("sb-access-token", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
