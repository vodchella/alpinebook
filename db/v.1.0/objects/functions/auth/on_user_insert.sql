CREATE OR REPLACE FUNCTION auth.on_user_insert()
  RETURNS trigger AS
$BODY$
begin
  insert into auth.resources_access (user_id, resource_name, read_access)
  values (new.user_id, 'summits', 'authorized');
  return new;
end
$BODY$
  LANGUAGE plpgsql;