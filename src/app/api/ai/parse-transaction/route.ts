import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text, currentDate } = await req.json();
    console.log("AI Parse Request:", text, "Today is:", currentDate);

    const { object } = await generateObject({
      model: google("gemini-flash-latest"),
      system: `Bạn là trợ lý tài chính thông minh chuyên bóc tách dữ liệu giao dịch từ văn bản tiếng Việt.
      Hãy phân tích văn bản người dùng nhập vào và trả về một đối tượng JSON có cấu trúc.
      - amount: số tiền (number).
      - type: 'expense' hoặc 'income'.
      - category: tên danh mục phù hợp nhất (Ăn uống, Giải trí, Di chuyển, Lương, Mua sắm, v.v.).
      - note: nội dung mô tả ngắn gọn.
      - date: ngày thực hiện (Sử dụng ngày hiện tại được cung cấp: ${currentDate || new Date().toISOString().split("T")[0]}).`,
      prompt: `Bóc tách giao dịch từ văn bản sau: "${text}"`,
      schema: z.object({
        amount: z.number(),
        type: z.enum(["income", "expense"]),
        category: z.string(),
        note: z.string(),
        date: z.string(),
      }),
    });

    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("AI Parse Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Không thể xử lý dữ liệu AI",
        details: message,
      }),
      {
        status: 500,
      },
    );
  }
}
