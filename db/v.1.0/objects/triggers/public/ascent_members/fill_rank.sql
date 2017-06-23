CREATE TRIGGER fill_rank
  BEFORE INSERT
  ON public.ascent_members
  FOR EACH ROW
  EXECUTE PROCEDURE public.fill_rank();