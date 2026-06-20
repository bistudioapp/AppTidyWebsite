const DEFAULT_OBJECT_KEY = "AppTidy-latest.dmg";
const DEFAULT_VERSION = "0.1.0";
const DEFAULT_FILENAME = `AppTidy-${DEFAULT_VERSION}.dmg`;
const DEFAULT_SHA256 = "8197fed802f54eef2d038c0ac2c220a0c23c56fca392fe8bbd371fa7dfb1b729";
const DMG_CONTENT_TYPE = "application/x-apple-diskimage";

function downloadBucket(env) {
  return env.APPTIDY_DOWNLOADS || env.APP_DOWNLOADS || env.DOWNLOADS || null;
}

function downloadKey(env) {
  return env.APPTIDY_DOWNLOAD_KEY || DEFAULT_OBJECT_KEY;
}

function downloadVersion(env) {
  return env.APPTIDY_DOWNLOAD_VERSION || DEFAULT_VERSION;
}

function downloadSha256(env) {
  return env.APPTIDY_DOWNLOAD_SHA256 || DEFAULT_SHA256;
}

function filenameForKey(key) {
  return key.split("/").filter(Boolean).pop() || DEFAULT_FILENAME;
}

function downloadFilename(env, key) {
  if (env.APPTIDY_DOWNLOAD_FILENAME) {
    return env.APPTIDY_DOWNLOAD_FILENAME;
  }

  const keyFilename = filenameForKey(key);
  if (keyFilename === DEFAULT_OBJECT_KEY) {
    return `AppTidy-${downloadVersion(env)}.dmg`;
  }

  return keyFilename;
}

function headersForObject(object, key, env) {
  const headers = new Headers();
  const sha256 = downloadSha256(env);

  headers.set("Content-Type", object?.httpMetadata?.contentType || DMG_CONTENT_TYPE);
  headers.set("Content-Disposition", `attachment; filename="${downloadFilename(env, key)}"`);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-AppTidy-Version", downloadVersion(env));

  if (sha256) {
    headers.set("X-AppTidy-SHA256", sha256);
  }

  if (object?.httpEtag) {
    headers.set("ETag", object.httpEtag);
  } else if (object?.etag) {
    headers.set("ETag", `"${object.etag}"`);
  }

  if (typeof object?.size === "number") {
    headers.set("Content-Length", String(object.size));
  }

  return headers;
}

function notFoundResponse(key) {
  return new Response(`AppTidy download is not available yet: ${key}`, {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function missingBucketResponse() {
  return new Response("AppTidy download storage is not configured.", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestGet({ env }) {
  const bucket = downloadBucket(env);
  if (!bucket) {
    return missingBucketResponse();
  }

  const key = downloadKey(env);
  const object = await bucket.get(key);
  if (!object) {
    return notFoundResponse(key);
  }

  return new Response(object.body, {
    headers: headersForObject(object, key, env),
  });
}

export async function onRequestHead({ env }) {
  const bucket = downloadBucket(env);
  if (!bucket) {
    return new Response(null, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const key = downloadKey(env);
  const object = await bucket.head(key);
  if (!object) {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(null, {
    headers: headersForObject(object, key, env),
  });
}
