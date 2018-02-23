CREATE TRIGGER areas_gen_hash_id
  BEFORE INSERT
  ON public.areas
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();