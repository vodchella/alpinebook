CREATE OR REPLACE FUNCTION public.get_route_text(
    r_id integer,
    include_mountain_name_bool boolean,
    include_complexity_bool boolean)
  RETURNS text AS
$BODY$
  select case
           when include_mountain_name_bool = true then
             m.mountain || ' '
           else
             ''
         end ||
         case
           when include_complexity_bool = true then
             r.complexity || ' '
           else
             ''
         end ||
         case r.traverse_bool
           when true then
             'тр-с до ' || em.mountain
           else
             r.route
         end
  from   routes r
         inner join mountains  m on (m.mountain_id = r.mountain_id)
         left  join mountains em on (em.mountain_id = r.ending_mountain_id)
  where  r.route_id = r_id;
$BODY$
  LANGUAGE sql;