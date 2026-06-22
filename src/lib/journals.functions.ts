import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CreateJournalInput = z.object({
  campaign_id: z.string().uuid(),
  menu: z.string().min(1).max(500),
  story: z.string().min(10).max(2000),
  mood: z.string().max(40).nullable().optional(),
  attendance: z.number().int().min(0).max(10000).nullable().optional(),
  photos: z.array(z.string().min(1)).min(1).max(8),
});

const ListJournalsInput = z.object({
  campaign_id: z.string().uuid(),
});

const DeleteJournalInput = z.object({ id: z.string().uuid() });

export const listJournals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ListJournalsInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("journals")
      .select("id, campaign_id, teacher_id, menu, story, mood, attendance, photos, created_at")
      .eq("campaign_id", data.campaign_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createJournal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CreateJournalInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify the user owns this campaign (RLS also enforces, but fail fast).
    const { data: campaign, error: cErr } = await supabase
      .from("campaigns")
      .select("id")
      .eq("id", data.campaign_id)
      .eq("teacher_id", userId)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!campaign) throw new Error("NOT_FOUND: Campaign not found or not yours.");

    const { data: created, error } = await supabase
      .from("journals")
      .insert({
        campaign_id: data.campaign_id,
        teacher_id: userId,
        menu: data.menu,
        story: data.story,
        mood: data.mood ?? null,
        attendance: data.attendance ?? null,
        photos: data.photos,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const deleteJournal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => DeleteJournalInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("id", data.id)
      .eq("teacher_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
