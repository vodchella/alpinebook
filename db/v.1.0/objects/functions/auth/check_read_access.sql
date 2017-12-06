CREATE OR REPLACE FUNCTION auth.check_read_access(
    u_id integer,
    resource text)
  RETURNS boolean AS
$BODY$
declare
  rec auth.resources_access % rowtype;
begin
  begin 
    select *
    into   rec
    from   auth.resources_access ra
    where  ra.resource_name = resource and
           ra.user_id = u_id;
  exception
    when others then
      return false;
  end;

  return auth.check_access(u_id, rec.read_access, rec.read_access_except);
end 
$BODY$
  LANGUAGE plpgsql;