CREATE OR REPLACE FUNCTION auth.check_access(
    user_id integer,
    access auth.access_group,
    access_except integer[])
  RETURNS boolean AS
$BODY$
declare
  except_arr  int[];
begin
  except_arr = coalesce(access_except, array[-1]::int[]);
  return case
       when access = 'all' then
         true
       when access = 'authorized' and auth.get_user_id() <> 0 then
         auth.get_user_id() != any(except_arr)
       when access = 'nobody' then
         case
           when user_id = auth.get_user_id() then
             true
           when auth.get_user_id() != any(except_arr) then
             false
           else
             true
         end
       else
         false
         end;
end 
$BODY$
  LANGUAGE plpgsql;