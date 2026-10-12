Windows installer is not hosted on Vercel.

The portal fetches the download URL from the backend API
(POST /me/download/windows), which returns WINDOWS_DOWNLOAD_URL
(typically Cloudflare R2 / object storage).
