CREATE TRIGGER ascents_gen_hash_id
  BEFORE INSERT
  ON public.ascents
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();