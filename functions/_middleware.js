export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === "www.app-tidy.com") {
    url.hostname = "app-tidy.com";
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
