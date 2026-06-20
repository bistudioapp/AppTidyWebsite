const DEFAULT_OBJECT_KEY = "AppTidy-latest.dmg";
const DEFAULT_FILENAME = "AppTidy-latest.dmg";
const DMG_CONTENT_TYPE = "application/x-apple-diskimage";

function downloadBucket(env) {
  return env.APPTIDY_DOWNLOADS || env.APP_DOWNLOADS || env.DOWNLOADS || null;
}

function downloadKey(env) {
  return env.APPTIDY_DOWNLOAD_KEY || DEFAULT_OBJECT_KEY;
}

function filenameForKey(key) {
  return key.split("/").filter(Boolean).pop() || DEFAULT_FILENAME;
}

function headersForObject(object, key) {
  const headers = new Headers();
  headers.set("Content-Type", object?.httpMetadata?.contentType || DMG_CONTENT_TYPE);
  headers.set("Content-Disposition", `attachment; filename="${filenameForKey(key)}"`);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("X-Content-Type-Options", "nosniff");

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
    headers: headersForObject(object, key),
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
    headers: headersForObject(object, key),
  });
}
