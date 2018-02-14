CREATE OR REPLACE FUNCTION public.get_route_json(id integer)
  RETURNS json AS
$BODY$
  select json_build_object('id', r.route_id,
                           'complexity', r.complexity,
                           'winter_complexity', winter_complexity,
                           'route_nature', route_nature,
                           'mountain', get_mountain_json(r.mountain_id),
                           'name', public.get_route_text(r.route_id, false, false),
                           'traverse', r.traverse_bool,
                           'ending_mountain', get_mountain_json(r.ending_mountain_id),
                           'first_ascender', get_alpinist_json(r.first_ascender_id),
                           'first_ascent_year', r.first_ascent_year,
                           'description', r.description) as route
  from   routes r
  where  r.route_id = id;
$BODY$
  LANGUAGE sql;