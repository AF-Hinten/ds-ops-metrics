import { clearSessionCookie, sendJson } from "./_auth.js";

export default function handler(request, response) {
  return sendJson(response, 200, { ok: true }, {
    "set-cookie": clearSessionCookie(request)
  });
}
