"use server";

import { COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
