import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const uiMessages = body.messages || [];
    const financialContext: string = body.financialContext || "";

    // Convert UI messages to model messages for streamText
    const modelMessages = await convertToModelMessages(uiMessages);

    const result = streamText({
      model: google("gemini-flash-latest"),
      system: `Bạn là trợ lý tài chính cá nhân mang tên Levi AI.

VAI TRÒ CỦA BẠN:
- Phân tích dữ liệu chi tiêu thực tế của người dùng
- Đưa ra lời khuyên tài chính cụ thể, dễ hiểu bằng tiếng Việt
- Trả lời câu hỏi về tình hình tài chính dựa trên dữ liệu thật bên dưới

DỮ LIỆU TÀI CHÍNH CỦA NGƯỜI DÙNG:
${financialContext || "Người dùng chưa có giao dịch nào."}

QUY TẮC TRẢ LỜI:
- Luôn sử dụng con số cụ thể từ dữ liệu trên khi phân tích
- Sử dụng định dạng Markdown (in đậm, danh sách, emoji)
- Giữ thái độ thân thiện, chuyên nghiệp
- Khi được hỏi "phân tích" hoặc "tổng quan", hãy tóm tắt toàn bộ tình hình: tổng thu, tổng chi, số dư, và chi tiêu lớn nhất
- Nếu người dùng chưa có giao dịch, hướng dẫn họ bắt đầu ghi chép`,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("AI Advisor Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Trợ lý đang bận, vui lòng thử lại sau.",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
