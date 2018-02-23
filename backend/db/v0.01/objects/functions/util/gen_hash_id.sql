CREATE OR REPLACE FUNCTION util.gen_hash_id()
  RETURNS trigger AS
$BODY$
declare
  table_name  text;
  id          bigint;
begin
  table_name := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME;
  if table_name = 'auth.users' then
    id := new.user_id;
  elsif table_name = 'public.alpinists' then
    id := new.alpinist_id;
  elsif table_name = 'public.alpinist_summits' then
    id := new.alpinist_summit_id;
  elsif table_name = 'public.areas' then
    id := new.area_id;
  elsif table_name = 'public.ascents' then
    id := new.ascent_id;
  elsif table_name = 'public.mountains' then
    id := new.mountain_id;
  elsif table_name = 'public.regions' then
    id := new.region_id;
  elsif table_name = 'public.routes' then
    id := new.route_id;
  else
    raise exception 'Unknown table';
  end if;

  new.hash_id := util.id_enc(id, table_name);

  return new;
end 
$BODY$
  LANGUAGE plpgsql;