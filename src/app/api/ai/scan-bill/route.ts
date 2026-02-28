import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { image, currentDate } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "Thiếu dữ liệu hình ảnh" }), {
        status: 400,
      });
    }

    const today = currentDate || new Date().toISOString().split("T")[0];

    // Get random API Key from list
    const apiKeys = (process.env.GEMINI_API_KEYS || "")
      .split(",")
      .filter(Boolean);
    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const google = createGoogleGenerativeAI({ apiKey: randomKey });

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Bạn là trợ lý tài chính thông minh chuyên trích xuất dữ liệu từ ảnh hóa đơn.
Hãy phân tích hình ảnh hóa đơn và trả về một đối tượng JSON có cấu trúc.
- amount: tổng số tiền thanh toán (number). Chỉ lấy số, không có ký tự tiền tệ.
- type: luôn là 'expense'.
- category: tên danh mục phù hợp nhất (Ăn uống, Mua sắm, Di chuyển, Hóa đơn & Tiện ích, Sức khỏe, Khác).
- note: tên cửa hàng hoặc nội dung tóm tắt ngắn gọn.
- date: ngày trên hóa đơn (Định dạng YYYY-MM-DD). Nếu không thấy ngày, sử dụng ngày hiện tại: ${today}.

Trích xuất thông tin giao dịch từ hóa đơn này.`,
            },
            {
              type: "image",
              image: image,
            },
          ],
        },
      ],
      schema: z.object({
        amount: z.number(),
        type: z.literal("expense"),
        category: z.string(),
        note: z.string(),
        date: z.string(),
      }),
    });

    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("AI Scan Bill Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Không thể quét hóa đơn",
        details: message,
      }),
      { status: 500 },
    );
  }
}
