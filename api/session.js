import { createSessionCookie, getSession, readBody, sendJson, verifyCredentials } from "./_auth.js";

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const session = getSession(request);
      if (!session) return sendJson(response, 401, { authenticated: false });
      return sendJson(response, 200, { authenticated: true, email: session.email });
    }

    if (request.method === "POST") {
      const body = await readBody(request);
      if (!verifyCredentials(body.email, body.password)) {
        return sendJson(response, 401, { error: "Invalid login." });
      }
      const email = String(body.email || "").trim();
      return sendJson(response, 200, { authenticated: true, email }, {
        "set-cookie": createSessionCookie(email, request)
      });
    }

    return sendJson(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(response, 500, { error: error.message || "Login is not configured." });
  }
}
