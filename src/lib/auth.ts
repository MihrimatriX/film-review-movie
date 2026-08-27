import { cookies } from "next/headers";

const COOKIE = "admin_session";
const COOKIE_VALUE = "ok";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === COOKIE_VALUE;
}

export { COOKIE, COOKIE_VALUE };
