import axios from "axios";

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getAccessToken() {
  // If token is still valid, reuse it
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await axios.post(
    "https://secure.soundcloud.com/oauth/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SOUNDCLOUD_CLIENT_ID}:${process.env.SOUNDCLOUD_CLIENT_SECRET}`,
          ).toString("base64"),
      },
    },
  );

  cachedToken = res.data.access_token;
  tokenExpiresAt = Date.now() + res.data.expires_in * 1000;

  return cachedToken;
}
