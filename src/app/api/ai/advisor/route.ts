import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const uiMessages = body.messages || [];
    const financialContext: string = body.financialContext || "";

    // Convert UI messages to model messages for streamText
    const modelMessages = await convertToModelMessages(uiMessages);

    // Get random API Key from list
    const apiKeys = (process.env.GEMINI_API_KEYS || "")
      .split(",")
      .filter(Boolean);
    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const google = createGoogleGenerativeAI({ apiKey: randomKey });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `Bạn là trợ lý AI thông minh mang tên Levi AI, được tích hợp trong ứng dụng quản lý tài chính cá nhân.

VAI TRÒ CHÍNH - TRỢ LÝ TÀI CHÍNH:
- Phân tích dữ liệu chi tiêu thực tế của người dùng
- Đưa ra lời khuyên tài chính cụ thể, dễ hiểu bằng tiếng Việt
- Trả lời câu hỏi về tình hình tài chính dựa trên dữ liệu thật bên dưới

VAI TRÒ MỞ RỘNG - TRỢ LÝ ĐA NĂNG:
- Bạn có thể trả lời các câu hỏi về mọi lĩnh vực: công nghệ, sức khỏe, giáo dục, nấu ăn, du lịch, giải trí, lập trình, khoa học, cuộc sống...
- Khi câu hỏi không liên quan đến tài chính, hãy trả lời tự nhiên, hữu ích như một trợ lý AI thông minh
- Nếu có thể, hãy khéo léo liên hệ câu trả lời với góc nhìn tài chính (ví dụ: chi phí, tiết kiệm, đầu tư liên quan)

DỮ LIỆU TÀI CHÍNH CỦA NGƯỜI DÙNG:
${financialContext || "Người dùng chưa có giao dịch nào."}

QUY TẮC TRẢ LỜI:
- Luôn sử dụng con số cụ thể từ dữ liệu trên khi phân tích tài chính
- Sử dụng định dạng Markdown (in đậm, danh sách, emoji)
- Giữ thái độ thân thiện, chuyên nghiệp, hài hước khi phù hợp
- Khi được hỏi "phân tích" hoặc "tổng quan", hãy tóm tắt toàn bộ tình hình: tổng thu, tổng chi, số dư, và chi tiêu lớn nhất
- Nếu người dùng chưa có giao dịch, hướng dẫn họ bắt đầu ghi chép
- Với câu hỏi ngoài tài chính, trả lời chi tiết và chính xác nhất có thể`,
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
