CREATE TRIGGER mountains_gen_hash_id
  BEFORE INSERT
  ON public.mountains
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();