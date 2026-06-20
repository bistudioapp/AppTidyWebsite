const DEFAULT_DOWNLOAD_URL = "https://downloads.app-tidy.com/AppTidy-latest.dmg";

export async function onRequestGet(context) {
  const downloadUrl = context.env.APPTIDY_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;

  return Response.redirect(downloadUrl, 302);
}

export async function onRequestHead(context) {
  const downloadUrl = context.env.APPTIDY_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;

  return Response.redirect(downloadUrl, 302);
}
