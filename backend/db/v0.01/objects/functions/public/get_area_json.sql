CREATE OR REPLACE FUNCTION public.get_area_json(id integer)
  RETURNS json AS
$BODY$
  select json_build_object('area_id', a.area_id,
                           'area', a.area,
                           'region', get_region_json(a.region_id)) as area
  from   areas a
  where  a.area_id = id;
$BODY$
  LANGUAGE sql;