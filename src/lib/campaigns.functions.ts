import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CreateCampaignInput = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(4000),
  school: z.string().min(2).max(160),
  target_amount: z.number().int().positive().max(1_000_000_000),
});

export const getMyActiveCampaign = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, title, description, school, target_amount, status, created_at, closed_at")
      .eq("teacher_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const createCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CreateCampaignInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Defensive app-level check (DB partial unique index is the real enforcement).
    const { data: existing, error: checkError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("teacher_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (checkError) throw new Error(checkError.message);
    if (existing) {
      throw new Error(
        "ACTIVE_CAMPAIGN_EXISTS: You already have an active campaign. Close it before creating a new one.",
      );
    }

    const { data: created, error } = await supabase
      .from("campaigns")
      .insert({
        teacher_id: userId,
        title: data.title,
        description: data.description,
        school: data.school,
        target_amount: data.target_amount,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      // Postgres unique_violation if a race slipped past the check above.
      if ((error as { code?: string }).code === "23505") {
        throw new Error(
          "ACTIVE_CAMPAIGN_EXISTS: You already have an active campaign. Close it before creating a new one.",
        );
      }
      throw new Error(error.message);
    }
    return created;
  });

export const closeMyActiveCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("campaigns")
      .update({ status: "closed", closed_at: new Date().toISOString() })
      .eq("teacher_id", userId)
      .eq("status", "active")
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("NO_ACTIVE_CAMPAIGN: There is no active campaign to close.");
    return data;
  });
