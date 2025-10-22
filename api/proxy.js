export default async function handler(req, res) {
  try {
    // 这里写你的代理逻辑，例如调用 Moonshot AI API
    const data = await fetch("https://api.moonshot.cn/v1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.sk-oUEqa6Zt6Ycd0x7f0vfsCodSBeRD75UeoPwfaJPBBov81JlA}`,
        "Content-Type": "application/json"
      }
    }).then(r => r.json());

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
}
