export function buildAuthHeaders(cookie: string): Record<string, string> {
  return { 'Cookie': cookie };
}
