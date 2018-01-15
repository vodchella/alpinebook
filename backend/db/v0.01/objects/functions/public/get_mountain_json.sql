CREATE OR REPLACE FUNCTION public.get_mountain_json(id integer)
  RETURNS json AS
$BODY$
  select json_build_object('mountain_id', m.mountain_id,
                           'mountain', m.mountain,
                           'altitude', m.altitude,
                           'area', get_area_json(m.area_id)) as mountain
  from   mountains m
  where  m.mountain_id = id;
$BODY$
  LANGUAGE sql;