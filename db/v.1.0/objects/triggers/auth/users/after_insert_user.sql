CREATE TRIGGER after_insert_user
  AFTER INSERT
  ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE auth.on_user_insert();