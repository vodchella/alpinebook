CREATE OR REPLACE FUNCTION auth.get_user_id()
  RETURNS integer AS
$BODY$
declare
  id integer;
begin
  begin 
    id := current_setting('alpinebook.current_user_id')::integer;
  exception
    when others then
      id := 0;
  end;
  return id;
end 
$BODY$
  LANGUAGE plpgsql;