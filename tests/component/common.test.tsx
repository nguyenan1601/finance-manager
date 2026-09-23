// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
  },
}));

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Panel } from "@/components/common/panel";
import { StatCardSkeleton } from "@/components/common/skeletons";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import { I18nProvider } from "@/contexts/i18n-context";
import { Wallet } from "lucide-react";

describe("PageHeader", () => {
  it("renders a single page heading with description and actions", () => {
    render(
      <PageHeader
        title="Giao dịch"
        description="Theo dõi thu chi"
        actions={<button type="button">Thêm</button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Giao dịch",
    );
    expect(screen.getByText("Theo dõi thu chi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm" })).toBeInTheDocument();
  });

  it("omits description and actions when not provided", () => {
    const { container } = render(<PageHeader title="Báo cáo" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});

describe("EmptyState", () => {
  it("announces the message and hides the decorative icon", () => {
    const { container } = render(
      <EmptyState
        icon={Wallet}
        title="Chưa có ngân sách nào"
        description="Thiết lập ngân sách để kiểm soát chi tiêu"
        action={<button type="button">Bắt đầu</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Chưa có ngân sách nào" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Bắt đầu" }),
    ).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("Panel", () => {
  it("renders a borderless card surface and merges extra classes", () => {
    const { container } = render(<Panel className="lg:col-span-4">body</Panel>);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.className).toContain("border-none");
    expect(panel.className).toContain("shadow-sm");
    expect(panel.className).toContain("lg:col-span-4");
  });
});

describe("StatCardSkeleton", () => {
  it("exposes a busy status region with a screen-reader label", () => {
    render(<StatCardSkeleton />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-busy", "true");
    expect(region).toHaveTextContent("Đang tải số liệu...");
  });
});

describe("StatCard", () => {
  it("uses the success token for an upward trend", () => {
    const { container } = render(
      <StatCard
        title="Thu nhập tháng này"
        value="1.000.000 đ"
        icon={Wallet}
        trend={{ value: "12%", isUp: true }}
      />,
    );

    const pill = container.querySelector("span");
    expect(pill?.className).toContain("bg-success-muted");
    expect(pill?.className).toContain("text-success");
    expect(pill).toHaveTextContent("+12%");
  });

  it("uses the danger token for a downward trend", () => {
    const { container } = render(
      <StatCard
        title="Chi tiêu tháng này"
        value="300.000 đ"
        icon={Wallet}
        trend={{ value: "5%", isUp: false }}
      />,
    );

    const pill = container.querySelector("span");
    expect(pill?.className).toContain("bg-danger-muted");
    expect(pill).toHaveTextContent("-5%");
  });

  it("hides the metric icon from assistive tech", () => {
    const { container } = render(
      <StatCard title="Tổng" value="0 đ" icon={Wallet} />,
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("TransactionItem", () => {
  const wrap = (ui: React.ReactElement) => render(<I18nProvider>{ui}</I18nProvider>);

  it("prefixes the amount with a screen-reader type label", async () => {
    wrap(
      <TransactionItem
        name="Ăn trưa"
        category="Ăn uống"
        amount="50.000 đ"
        type="expense"
        date="10/03/2026"
      />,
    );

    expect(await screen.findByText(/Chi tiêu:/)).toBeInTheDocument();
  });

  it("uses the success tone for income rows", async () => {
    const { container } = wrap(
      <TransactionItem
        name="Lương"
        category="Lương"
        amount="20.000.000 đ"
        type="income"
        date="05/03/2026"
      />,
    );

    expect(await screen.findByText(/Thu nhập:/)).toBeInTheDocument();
    expect(container.innerHTML).toContain("text-success");
  });

  it("falls back to a direction arrow when no icon is given", async () => {
    const { container } = wrap(
      <TransactionItem
        name="Xăng xe"
        category="Di chuyển"
        amount="400.000 đ"
        type="expense"
        date="12/03/2026"
      />,
    );

    expect(await screen.findByText("Xăng xe")).toBeInTheDocument();
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
