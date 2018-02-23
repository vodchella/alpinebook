CREATE TRIGGER alpinist_summits_gen_hash_id
  BEFORE INSERT
  ON public.alpinist_summits
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();