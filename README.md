# Exnify JavaScript SDK

Official TypeScript/JavaScript client for the [Exnify](https://exnify.com) currency exchange API.

```bash
npm install @exnify/exnify
npm run build
```

```typescript
import { Exnify } from "@exnify/exnify";

const client = new Exnify("YOUR_API_KEY");
const { data } = await client.latest();
```
