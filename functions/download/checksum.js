const DEFAULT_VERSION = "0.1.2";
const DEFAULT_FILENAME = `AppTidy-${DEFAULT_VERSION}.dmg`;
const DEFAULT_SHA256 = "68959d3532266389ea69c84d6ca174334f1268805c81bb2553cd78654778687e";

function downloadVersion(env) {
  return env.APPTIDY_DOWNLOAD_VERSION || DEFAULT_VERSION;
}

function downloadFilename(env) {
  return env.APPTIDY_DOWNLOAD_FILENAME || `AppTidy-${downloadVersion(env)}.dmg`;
}

function downloadSha256(env) {
  return env.APPTIDY_DOWNLOAD_SHA256 || DEFAULT_SHA256;
}

export async function onRequestGet({ env }) {
  return new Response(`${downloadSha256(env)}  ${downloadFilename(env)}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
