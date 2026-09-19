import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // /api/ai checks the signed-in user itself; refreshing the session here keeps
  // an admin whose access token expired mid-edit from getting a spurious 401.
  matcher: ["/admin/:path*", "/api/ai/:path*"],
};
