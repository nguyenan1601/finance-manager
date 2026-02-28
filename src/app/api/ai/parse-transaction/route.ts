import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";

// Optimized system prompt — concise, with few-shot examples for faster inference
const SYSTEM_PROMPT = `Bạn là parser giao dịch tài chính chuyên nghiệp.
Phân tích văn bản → trả JSON.
QUY TẮC QUAN TRỌNG:
- amount: Luôn trả về số tiền quy đổi ra VND (number).
- Nếu thấy ký hiệu $, USD: Nhân số đó với [USD_TO_VND] (tỷ giá được cấp) để ra VND.
- type: "expense" | "income"
- category: chọn 1 trong [Ăn uống, Mua sắm, Di chuyển, Giải trí, Sức khỏe, Giáo dục, Hóa đơn, Lương, Thưởng, Đầu tư, Tiết kiệm, Khác]
- note: mô tả ngắn gọn (tối đa 10 từ)
- date: YYYY-MM-DD

Ví dụ (Tỷ giá 25000):
Input: "mua máy tính $1000"
→ {"amount":25000000,"type":"expense","category":"Mua sắm","note":"Mua máy tính","date":"2026-02-21"}

Input: "ăn trưa 50k"
→ {"amount":50000,"type":"expense","category":"Ăn uống","note":"Ăn trưa","date":"2026-02-21"}`;

const transactionSchema = z.object({
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  note: z.string(),
  date: z.string(),
});

export async function POST(req: Request) {
  try {
    const { text, currentDate } = await req.json();

    const today = currentDate || new Date().toISOString().split("T")[0];

    // Fetch real-time exchange rate VND -> USD
    let vndToUsd = 0.000039; // Fallback
    try {
      const rateResp = await fetch("https://open.er-api.com/v6/latest/VND");
      const rateData = await rateResp.json();
      if (rateData.result === "success" && rateData.rates.USD) {
        vndToUsd = rateData.rates.USD;
      }
    } catch (e) {
      console.warn("Failed to fetch exchange rate, using fallback", e);
    }

    const usdToVnd = Math.round(1 / vndToUsd);

    // Get random API Key from list
    const apiKeys = (process.env.GEMINI_API_KEYS || "")
      .split(",")
      .filter(Boolean);
    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const google = createGoogleGenerativeAI({ apiKey: randomKey });

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT.replace("[USD_TO_VND]", usdToVnd.toString()),
      prompt: `Hôm nay: ${today}. Tỷ giá hiện tại: 1$ = ${usdToVnd} VND. Hãy parse văn bản sau: "${text}"`,
      schema: transactionSchema,
    });

    return Response.json({ ...object, exchangeRate: vndToUsd });
  } catch (error: unknown) {
    console.error("AI Parse Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "Không thể xử lý dữ liệu AI", details: message },
      { status: 500 },
    );
  }
}
