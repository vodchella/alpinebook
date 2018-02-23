CREATE TRIGGER alpinists_gen_hash_id
  BEFORE INSERT
  ON public.alpinists
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();