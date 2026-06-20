const DEFAULT_VERSION = "0.1.3";
const DEFAULT_FILENAME = `AppTidy-${DEFAULT_VERSION}.dmg`;
const DEFAULT_SHA256 = "456097efd14b4fa5131d2ad81750183bad324ed1499eb03593316c9ead3faab6";

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
