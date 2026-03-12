export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const domain = typeof req.query?.domain === "string" ? req.query.domain : "";
  const normalizedDomain = domain.trim().toLowerCase();

  // Basic SSRF guard: only allow *.funnelliner.store domains
  if (!normalizedDomain || !normalizedDomain.endsWith(".funnelliner.store")) {
    return res.status(400).json({
      message: "Invalid domain",
    });
  }

  const url = `https://${normalizedDomain}/api/revalidate`;

  try {
    const upstreamRes = await fetch(url, { method: "GET" });
    const data = await upstreamRes.json().catch(() => null);
    return res.status(upstreamRes.status).json(data ?? { ok: upstreamRes.ok });
  } catch (error) {
    return res.status(502).json({ message: "Revalidate proxy failed" });
  }
}

