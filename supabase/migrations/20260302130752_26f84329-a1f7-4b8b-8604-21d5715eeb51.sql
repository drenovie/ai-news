CREATE POLICY "Users can update their own preferences"
ON public.user_club_preferences
FOR UPDATE
USING (auth.uid() = user_id);