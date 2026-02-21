import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";

// Optimized system prompt — concise, with few-shot examples for faster inference
const SYSTEM_PROMPT = `Bạn là parser giao dịch tài chính.
Phân tích văn bản → trả JSON.
Quy tắc:
- amount: số tiền (number, không có đơn vị)
- type: "expense" | "income"  
- category: chọn 1 trong [Ăn uống, Mua sắm, Di chuyển, Giải trí, Sức khỏe, Giáo dục, Hóa đơn, Lương, Thưởng, Đầu tư, Tiết kiệm, Khác]
- note: mô tả ngắn gọn (tối đa 10 từ)
- date: YYYY-MM-DD

Ví dụ:
Input: "ăn phở 50k hôm qua" (hôm nay 2026-02-20)
→ {"amount":50000,"type":"expense","category":"Ăn uống","note":"Ăn phở","date":"2026-02-19"}

Input: "nhận lương 15 triệu"
→ {"amount":15000000,"type":"income","category":"Lương","note":"Nhận lương","date":"2026-02-20"}

Input: "grab đi làm 35k"  
→ {"amount":35000,"type":"expense","category":"Di chuyển","note":"Grab đi làm","date":"2026-02-20"}`;

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

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      prompt: `Hôm nay: ${today}. Parse: "${text}"`,
      schema: transactionSchema,
    });

    return Response.json(object);
  } catch (error: unknown) {
    console.error("AI Parse Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "Không thể xử lý dữ liệu AI", details: message },
      { status: 500 },
    );
  }
}
