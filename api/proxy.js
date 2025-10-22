export default async function handler(req, res) {
    const targetUrl = "https://api.moonshot.cn/v1";
    const apiKey = process.env.sk-oUEqa6Zt6Ycd0x7f0vfsCodSBeRD75UeoPwfaJPBBov81JlA;
  
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  
