export interface ExnifyConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: Record<string, unknown>;
    error?: {
        message: string;
        code?: string;
    };
}
export type HistoryRange = "1d" | "7d" | "30d" | "1y" | "5y" | "10y";
export declare class ExnifyError extends Error {
    status: number;
    code?: string | undefined;
    constructor(message: string, status: number, code?: string | undefined);
}
export declare class Exnify {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(apiKeyOrConfig: string | ExnifyConfig, baseUrl?: string);
    private request;
    status(): Promise<ApiResponse<{
        status: string;
        plan: string;
        quota: number | null;
        usedThisMonth: number;
        remaining: number | null;
        rateLimitPerMinute: number | null;
        premiumEndpoints: boolean;
    }>>;
    currencies(): Promise<ApiResponse<{
        code: string;
        name: string;
        symbol: string;
        country: string;
        flag: string;
    }[]>>;
    symbols(): Promise<ApiResponse<{
        code: string;
        name: string;
        symbol: string;
        country: string;
        flag: string;
    }[]>>;
    latest(base?: string): Promise<ApiResponse<{
        code: string;
        rate: number;
        change: number;
        updatedAt: string;
        flag?: string;
    }[]>>;
    popular(): Promise<ApiResponse<{
        code: string;
        rate: number;
        change: number;
        updatedAt: string;
        flag?: string;
    }[]>>;
    convert(from: string, to: string, amount: number): Promise<ApiResponse<{
        from: string;
        to: string;
        fromFlag: string;
        toFlag: string;
        amount: number;
        result: number;
        rate: number;
        timestamp: string;
    }>>;
    history(from: string, to: string, start: string, end: string): Promise<ApiResponse<{
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
    }[]>>;
    historyRange(from: string, to: string, range: HistoryRange): Promise<ApiResponse<{
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
    }[]>>;
}
export default Exnify;
