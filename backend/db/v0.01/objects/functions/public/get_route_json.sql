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
                           'description', r.description,
                           'attachments', (select json_agg(json_build_object(
                                                    'id', a.route_attachment_id,
                                                    'name', a.file_name,
                                                    'content_type', a.content_type,
                                                    'url', a.url))
                                           from   route_attachments a
                                           where  a.route_id = r.route_id)
                           ) as route
  from   routes r
  where  r.route_id = id;
$BODY$
  LANGUAGE sql;