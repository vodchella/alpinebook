CREATE TRIGGER users_gen_hash_id
  BEFORE INSERT
  ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE util.gen_hash_id();