CREATE OR REPLACE FUNCTION auth.set_user_id(id integer)
  RETURNS boolean AS
$BODY$
begin
  perform set_config('alpinebook.current_user_id', id::text, false);
  return true;
end 
$BODY$
  LANGUAGE plpgsql;