const CG_KEY = process.env.COINGECKO_API_KEY!;

const ORIGINS = new Set([
  "https://staging.yumdao.org",
  "https://yumdao.org",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cacaoswap.app",
  "https://test.cacaoswap.app",
]);

export const handler = async (event: any) => {
  const origin = event.headers?.origin;
  const corsAllowed = ORIGINS.has(origin) ? origin : null;

  if (event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        ...(corsAllowed
          ? {
              "Access-Control-Allow-Origin": corsAllowed,
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "content-type",
              "Access-Control-Max-Age": "86400",
            }
          : {}),
      },
      body: "",
    };
  }

  try {
    const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const path = event.rawPath?.replace(/^\/cg/, "") || "";

    const target = `https://pro-api.coingecko.com${path}${qs}`;

    const response = await fetch(target, {
      headers: { "x-cg-pro-api-key": CG_KEY },
    });

    const body = await response.arrayBuffer();

    return {
      statusCode: response.status,
      headers: {
        ...(corsAllowed
          ? {
              "Access-Control-Allow-Origin": corsAllowed,
              Vary: "Origin",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "content-type",
            }
          : {}),
        "Cache-Control": "public, s-maxage=120, max-age=60",
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
      isBase64Encoded: true,
      body: Buffer.from(body).toString("base64"),
    };
  } catch (e) {
    return res(502, { error: "upstream_failed" }, corsAllowed);
  }
};

function res(code: number, json: any, origin: string | null) {
  return {
    statusCode: code,
    headers: {
      ...(origin
        ? {
            "Access-Control-Allow-Origin": origin,
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "content-type",
          }
        : {}),
      "Cache-Control": "public, s-maxage=30, max-age=30",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  };
}
