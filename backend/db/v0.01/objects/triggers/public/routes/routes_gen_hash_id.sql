CREATE TRIGGER routes_gen_hash_id
  BEFORE INSERT
  ON public.routes
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();