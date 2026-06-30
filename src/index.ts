export interface ExnifyConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: { message: string; code?: string };
}

export type HistoryRange = "1d" | "7d" | "30d" | "1y" | "5y" | "10y";

export class ExnifyError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ExnifyError";
  }
}

export class Exnify {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKeyOrConfig: string | ExnifyConfig, baseUrl?: string) {
    if (typeof apiKeyOrConfig === "string") {
      this.apiKey = apiKeyOrConfig;
      this.baseUrl = (baseUrl ?? "https://api.exnify.com").replace(/\/$/, "");
    } else {
      this.apiKey = apiKeyOrConfig.apiKey;
      this.baseUrl = (apiKeyOrConfig.baseUrl ?? "https://api.exnify.com").replace(/\/$/, "");
    }
  }

  private async request<T>(path: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url, {
      headers: { "X-Api-Key": this.apiKey },
    });

    const body = (await res.json()) as ApiResponse<T>;
    if (!res.ok || !body.success) {
      throw new ExnifyError(
        body.error?.message ?? `Request failed with status ${res.status}`,
        res.status,
        body.error?.code
      );
    }

    return body;
  }

  status() {
    return this.request<{
      status: string;
      plan: string;
      quota: number | null;
      usedThisMonth: number;
      remaining: number | null;
      rateLimitPerMinute: number | null;
      premiumEndpoints: boolean;
    }>("/v1/status");
  }

  currencies() {
    return this.request<Array<{ code: string; name: string; symbol: string; country: string; flag: string }>>(
      "/v1/currencies"
    );
  }

  symbols() {
    return this.currencies();
  }

  latest(base?: string) {
    return this.request<Array<{ code: string; rate: number; change: number; updatedAt: string; flag?: string }>>(
      "/v1/latest",
      base ? { base } : undefined
    );
  }

  popular() {
    return this.request<Array<{ code: string; rate: number; change: number; updatedAt: string; flag?: string }>>(
      "/v1/popular"
    );
  }

  convert(from: string, to: string, amount: number) {
    return this.request<{
      from: string;
      to: string;
      fromFlag: string;
      toFlag: string;
      amount: number;
      result: number;
      rate: number;
      timestamp: string;
    }>("/v1/convert", { from, to, amount });
  }

  history(from: string, to: string, start: string, end: string) {
    return this.request<Array<{ date: string; open: number; high: number; low: number; close: number }>>(
      "/v1/history",
      { from, to, start, end }
    );
  }

  historyRange(from: string, to: string, range: HistoryRange) {
    return this.request<Array<{ date: string; open: number; high: number; low: number; close: number }>>(
      "/v1/history/range",
      { from, to, range }
    );
  }
}

export default Exnify;
