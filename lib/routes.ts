// Root path of the application
export const ROOT = "/";

/**
 * Array of routes that are accessible to the public (non-logged-in users)
 * @type {string[]} - collections of authentication route
 */
export const PUBLIC_ROUTES: string[] = ["/", "/auth", "/auth/verify_email", "/auth/forgot_password", "/auth/reset_password"];

/**
 * Array of routes that are used for authentication and are accessible to the public (non-logged-in users)
 * @type {string[]} - collections of authentication route.
 */
export const AUTH_ROUTES: string[] = ["/auth/login", "/auth/register"];

// Default redirect path after login or when accessing protected routes
export const DEFAULT_REDIRECT = "/settings";

/**
 * The prefix for API authentication routes, used for API authentication purposes.
 * @type {string} - prefix for API authentication routes.
 */
export const API_AUTH_PREFIX: string = "/api";
