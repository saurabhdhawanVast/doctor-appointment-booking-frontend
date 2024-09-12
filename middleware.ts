import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;

  const userRole = request.cookies.get("role")?.value;

  // const role=sessionStorage.getItem('role')
  // const authToken = sessionStorage.getItem("token");
  console.log(authToken);
  const currentPath = request.nextUrl.pathname;

  // Allow access to login and register pages regardless of authentication status
  if (currentPath === "/login" || currentPath === "/register") {
    return NextResponse.next();
  }

  // If no token is present, redirect to the login page
  if (!authToken) {
    console.log("authToken Not Found");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Ensure that the user can only access paths that start with their role
  console.log(userRole);
  const rolePathPattern = new RegExp(`^/${userRole}`);

  if (!rolePathPattern.test(currentPath)) {
    console.log(`User role ${userRole} does not have access to ${currentPath}`);
    return NextResponse.redirect(new URL(`/${userRole}`, request.url));
  }

  // Allow access to the requested path if all conditions are met
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/patient/:path*", "/admin/:path*", "/doctor/:path*"],
};
