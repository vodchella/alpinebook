CREATE TRIGGER on_ascent_complete_cancelation
  AFTER UPDATE OF successfully_completed_bool
  ON public.ascent_members
  FOR EACH ROW
  WHEN (((COALESCE(old.successfully_completed_bool, false) <> COALESCE(new.successfully_completed_bool, false)) AND (NOT new.successfully_completed_bool)))
  EXECUTE PROCEDURE public.on_ascent_complete_cancelation();