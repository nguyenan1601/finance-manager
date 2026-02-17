import { supabase } from "./supabase";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  user_id: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  category_id: string;
  note: string;
  date: string;
  created_at?: string;
  categories?: {
    name: string;
    icon?: string;
    color?: string;
  };
}

export const db = {
  // Transactions
  async getTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          name,
          icon,
          color
        )
      `,
      )
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Profiles - ensure profile exists using upsert (handles RLS gracefully)
  async ensureProfile(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: userId, full_name: "Người dùng" },
          { onConflict: "id", ignoreDuplicates: true },
        );
      if (error) {
        // Non-blocking: log but don't throw - profile may already exist
        console.warn("ensureProfile warning:", error.message);
      }
    } catch (e) {
      console.warn("ensureProfile failed (non-blocking):", e);
    }
  },

  async addTransaction(transaction: Omit<Transaction, "id" | "categories">) {
    // Ensure profile exists because of FK constraint in DB
    await this.ensureProfile(transaction.user_id);

    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Categories
  async getCategories(type?: "income" | "expense"): Promise<Category[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // Always ensure user has default categories
    await this.seedDefaultCategories(user.id);

    let query = supabase.from("categories").select("*").eq("user_id", user.id);
    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  async seedDefaultCategories(userId: string) {
    const defaultCategories = [
      // Expenses
      {
        user_id: userId,
        name: "Ăn uống",
        type: "expense",
        icon: "Utensils",
        color: "#f97316",
      },
      {
        user_id: userId,
        name: "Di chuyển",
        type: "expense",
        icon: "Car",
        color: "#3b82f6",
      },
      {
        user_id: userId,
        name: "Mua sắm",
        type: "expense",
        icon: "ShoppingBag",
        color: "#f43f5e",
      },
      {
        user_id: userId,
        name: "Giải trí",
        type: "expense",
        icon: "Gamepad2",
        color: "#a855f7",
      },
      {
        user_id: userId,
        name: "Nhà cửa",
        type: "expense",
        icon: "Home",
        color: "#6366f1",
      },
      {
        user_id: userId,
        name: "Sức khỏe",
        type: "expense",
        icon: "Stethoscope",
        color: "#10b981",
      },
      {
        user_id: userId,
        name: "Giáo dục",
        type: "expense",
        icon: "BookOpen",
        color: "#8b5cf6",
      },
      {
        user_id: userId,
        name: "Hóa đơn & Tiện ích",
        type: "expense",
        icon: "Zap",
        color: "#eab308",
      },
      {
        user_id: userId,
        name: "Đám tiệc",
        type: "expense",
        icon: "Gift",
        color: "#ec4899",
      },
      {
        user_id: userId,
        name: "Hiếu hỉ",
        type: "expense",
        icon: "Heart",
        color: "#f43f5e",
      },
      {
        user_id: userId,
        name: "Khác",
        type: "expense",
        icon: "MoreHorizontal",
        color: "#64748b",
      },

      // Income
      {
        user_id: userId,
        name: "Lương",
        type: "income",
        icon: "Banknote",
        color: "#10b981",
      },
      {
        user_id: userId,
        name: "Thưởng",
        type: "income",
        icon: "Trophy",
        color: "#f59e0b",
      },
      {
        user_id: userId,
        name: "Đầu tư",
        type: "income",
        icon: "TrendingUp",
        color: "#06b6d4",
      },
      {
        user_id: userId,
        name: "Quà tặng",
        type: "income",
        icon: "Gift",
        color: "#f43f5e",
      },
      {
        user_id: userId,
        name: "Khác",
        type: "income",
        icon: "MoreHorizontal",
        color: "#64748b",
      },
    ];

    // Use upsert to avoid duplicates if constraint exists, or just insert
    // Since we added UNIQUE constraint, we can use it to avoid duplicates
    const { error } = await supabase
      .from("categories")
      .upsert(defaultCategories, { onConflict: "user_id,name,type" });

    if (error) {
      console.warn("Category sync notice (may already exist):", error.message);
    }
  },

  async getCategoryIdByName(
    name: string,
    type: "income" | "expense",
    userId: string,
  ) {
    // Ensure profile exists because categories might reference profiles table
    await this.ensureProfile(userId);

    // Try to find existing category
    const { data: existing, error: findError } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("name", name)
      .eq("type", type)
      .maybeSingle();

    if (findError) throw findError;
    if (existing) return existing.id;

    // Create new category if not found
    const { data: created, error: createError } = await supabase
      .from("categories")
      .insert([{ user_id: userId, name, type }])
      .select("id")
      .single();

    if (createError) throw createError;
    return created.id;
  },

  async resetTransactions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  },

  async getBudgets() {
    const { data, error } = await supabase.from("budgets").select(`
        *,
        categories (
          name,
          icon,
          color
        )
      `);

    if (error) throw error;
    return data;
  },

  async addBudget(budget: Omit<Budget, "id" | "categories">) {
    const { data, error } = await supabase.from("budgets").insert([budget])
      .select(`
        *,
        categories (
          name,
          icon,
          color
        )
      `);

    if (error) throw error;
    return data[0];
  },

  async updateBudget(
    id: string,
    budget: Partial<Omit<Budget, "id" | "categories">>,
  ) {
    const { data, error } = await supabase
      .from("budgets")
      .update(budget)
      .eq("id", id).select(`
        *,
        categories (
          name,
          icon,
          color
        )
      `);

    if (error) throw error;
    return data[0];
  },

  async deleteBudget(id: string) {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw error;
  },

  // Profile updates
  async updateProfile(
    userId: string,
    updates: {
      full_name?: string;
      avatar_url?: string;
      language?: string;
      currency?: string;
    },
  ) {
    // Sử dụng upsert để đảm bảo bản ghi tồn tại
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...updates });

    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File) {
    // Tạo tên file duy nhất (vd: userId-timestamp.ext)
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Tải lên Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      throw uploadError;
    }

    // Lấy URL công khai
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrl);

    // Cập nhật URL vào bảng profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (profileError) {
      console.error("Profile update error with avatar_url:", profileError);
      throw profileError;
    }

    return publicUrl;
  },
};

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  categories: {
    name: string;
    icon?: string;
    color?: string;
  };
}
