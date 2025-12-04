export class HeadersBuilder {
  private readonly headers: Record<string, string> = {};

  withCookie(cookie: string): this {
    this.headers["Cookie"] = cookie;
    return this;
  }

  withAuthorization(token: string): this {
    this.headers["Authorization"] = token;
    return this;
  }

  asRecord(): Record<string, string> {
    return this.headers;
  }
}
