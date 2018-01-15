CREATE TRIGGER after_update_statement
  AFTER UPDATE OF successfully_completed_bool
  ON public.ascent_members
  FOR EACH STATEMENT
  EXECUTE PROCEDURE public.write_in_summits();