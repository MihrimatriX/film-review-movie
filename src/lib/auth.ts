import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  getAdminPassword,
  verifySessionToken,
} from "@/lib/session-token";

const COOKIE = SESSION_COOKIE;

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export { COOKIE, getAdminPassword };
