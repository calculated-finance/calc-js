import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const sm = new SecretsManagerClient({});
let CG_KEY;

const ORIGINS = new Set(["https://staging.yumdao.org", "https://yumdao.org"]);

export const handler = async (event: any) => {
  const origin = event.headers?.origin;
  const corsAllowed = ORIGINS.has(origin) ? origin : null;

  try {
    const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const path = event.rawPath?.replace(/^\/cg/, "") || "";

    CG_KEY ||= (
      await sm.send(
        new GetSecretValueCommand({ SecretId: "COINGECKO_PRO_KEY" })
      )
    ).SecretString;

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
