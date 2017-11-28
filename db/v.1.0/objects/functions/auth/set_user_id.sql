CREATE OR REPLACE FUNCTION auth.set_user_id(id integer)
  RETURNS boolean AS
$BODY$
declare
  res bool;
begin
  select count(*) > 0
  into   res
  from   auth.users u
  where  u.user_id = id and
         u.active_bool;

  if res then
    perform set_config('alpinebook.current_user_id', id::text, false);
  end if;
  
  return res;
end 
$BODY$
  LANGUAGE plpgsql;