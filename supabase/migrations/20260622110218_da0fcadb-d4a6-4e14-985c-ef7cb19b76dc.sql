
-- ============ journals table ============
CREATE TABLE public.journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu text NOT NULL,
  story text NOT NULL,
  mood text,
  attendance int,
  photos text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX journals_campaign_idx ON public.journals (campaign_id, created_at DESC);
CREATE INDEX journals_teacher_idx ON public.journals (teacher_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.journals TO authenticated;
GRANT ALL ON public.journals TO service_role;

ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Anyone signed in can read journals (donors viewing campaign updates).
CREATE POLICY "Authenticated users can view journals"
  ON public.journals FOR SELECT TO authenticated
  USING (true);

-- Only the teacher who owns the campaign can insert/update/delete their journals.
CREATE POLICY "Teachers can create journals for their campaigns"
  ON public.journals FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own journals"
  ON public.journals FOR UPDATE TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own journals"
  ON public.journals FOR DELETE TO authenticated
  USING (auth.uid() = teacher_id);

-- ============ storage.objects policies for journal-photos ============
-- Path convention: <teacher_id>/<campaign_id>/<filename>
CREATE POLICY "Authenticated can view journal photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'journal-photos');

CREATE POLICY "Teachers can upload their own journal photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'journal-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Teachers can update their own journal photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'journal-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Teachers can delete their own journal photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'journal-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
