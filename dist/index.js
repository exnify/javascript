export class ExnifyError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = "ExnifyError";
    }
}
export class Exnify {
    apiKey;
    baseUrl;
    constructor(apiKeyOrConfig, baseUrl) {
        if (typeof apiKeyOrConfig === "string") {
            this.apiKey = apiKeyOrConfig;
            this.baseUrl = (baseUrl ?? "https://api.exnify.com").replace(/\/$/, "");
        }
        else {
            this.apiKey = apiKeyOrConfig.apiKey;
            this.baseUrl = (apiKeyOrConfig.baseUrl ?? "https://api.exnify.com").replace(/\/$/, "");
        }
    }
    async request(path, params) {
        const url = new URL(`${this.baseUrl}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, String(value));
            }
        }
        const res = await fetch(url, {
            headers: { "X-Api-Key": this.apiKey },
        });
        const body = (await res.json());
        if (!res.ok || !body.success) {
            throw new ExnifyError(body.error?.message ?? `Request failed with status ${res.status}`, res.status, body.error?.code);
        }
        return body;
    }
    status() {
        return this.request("/v1/status");
    }
    currencies() {
        return this.request("/v1/currencies");
    }
    symbols() {
        return this.currencies();
    }
    latest(base) {
        return this.request("/v1/latest", base ? { base } : undefined);
    }
    popular() {
        return this.request("/v1/popular");
    }
    convert(from, to, amount) {
        return this.request("/v1/convert", { from, to, amount });
    }
    history(from, to, start, end) {
        return this.request("/v1/history", { from, to, start, end });
    }
    historyRange(from, to, range) {
        return this.request("/v1/history/range", { from, to, range });
    }
}
export default Exnify;
