CREATE OR REPLACE FUNCTION public.get_ascent_members_text(
    alp_id integer,
    asc_id integer)
  RETURNS text AS
$BODY$
declare
  members text;
  cnt     integer;
begin
  select count(*)
  into   cnt
  from   ascent_members m
  where  m.ascent_id = asc_id and
         m.successfully_completed_bool;
 
  select case cnt
           when 2 then
             (select max('В двойке с ' || al.last_name)
              from   ascent_members am
                     inner join alpinists  al  using (alpinist_id)
              where  am.ascent_id = a.ascent_id and
                     am.successfully_completed_bool and
                     am.alpinist_id <> m.alpinist_id)
           when 1 then
             'Соло'
           else
             (select max(case am.leader_bool
                       when true then al.last_name
                     end) || ' +' || count(*) - 1
              from   ascent_members am
                     inner join alpinists  al  using (alpinist_id)
              where  am.ascent_id = a.ascent_id and
                     am.successfully_completed_bool)
         end
  into   members
  from   ascents a
         inner join ascent_members m using (ascent_id)
  where  a.ascent_id = asc_id and
         m.alpinist_id = alp_id and
         m.successfully_completed_bool;

  return members;
end
$BODY$
  LANGUAGE plpgsql;