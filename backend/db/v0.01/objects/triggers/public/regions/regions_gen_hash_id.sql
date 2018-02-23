CREATE TRIGGER regions_gen_hash_id
  BEFORE INSERT
  ON public.regions
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();