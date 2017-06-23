CREATE OR REPLACE FUNCTION public.check_route_validity()
  RETURNS trigger AS
$BODY$
begin
  if new.traverse_bool and new.ending_mountain_id is null then
    raise exception 'Необходимо указать конечную гору траверса';
  end if;
  if (not new.traverse_bool) and util.string_is_null_or_empty(new.route) then
    raise exception 'Необходимо указать маршрут';
  end if;
  return new;
end 
$BODY$
  LANGUAGE plpgsql;