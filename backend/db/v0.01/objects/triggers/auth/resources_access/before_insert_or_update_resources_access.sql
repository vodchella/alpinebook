CREATE TRIGGER before_insert_or_update_resources_access
  BEFORE INSERT OR UPDATE
  ON auth.resources_access
  FOR EACH ROW
  EXECUTE PROCEDURE auth.check_self_id_not_in_exceptions();