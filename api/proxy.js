export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.moonshot.cn/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.sk-oUEqa6Zt6Ycd0x7f0vfsCodSBeRD75UeoPwfaJPBBov81JlA}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
