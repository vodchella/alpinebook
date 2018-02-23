CREATE OR REPLACE FUNCTION public.get_alpinist_json(id integer)
  RETURNS json AS
$BODY$
  select json_build_object('id', a.hash_id,
                           'last_name', a.last_name,
                           'first_name', a.first_name,
                           'middle_name', a.middle_name,
                           'rank', a.rank) as alpinist
  from   alpinists a
  where  a.alpinist_id = id;
$BODY$
  LANGUAGE sql;