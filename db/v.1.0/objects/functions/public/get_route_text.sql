CREATE OR REPLACE FUNCTION public.get_route_text(r_id integer)
  RETURNS text AS
$BODY$
  select r.complexity || ' ' ||
         case r.traverse_bool
           when true then
             'траверс до ' || em.mountain
           else
             r.route
         end
  from   routes r
         left  join mountains em on (em.mountain_id = r.ending_mountain_id)
  where  r.route_id = r_id;
$BODY$
  LANGUAGE sql;