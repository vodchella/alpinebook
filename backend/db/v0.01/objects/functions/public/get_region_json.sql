CREATE OR REPLACE FUNCTION public.get_region_json(id integer)
  RETURNS json AS
$BODY$
  select json_build_object('id', r.region_id,
                           'name', r.region) as region
  from   regions r
  where  r.region_id = id;
$BODY$
  LANGUAGE sql;