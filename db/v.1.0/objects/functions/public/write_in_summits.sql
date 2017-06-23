CREATE OR REPLACE FUNCTION public.write_in_summits()
  RETURNS trigger AS
$BODY$
declare
  members        text;
  members_array  integer[];
begin
  begin 
    members := current_setting('alpinebook.members_who_complited_ascent');
  exception
    when others then
      members := '';
  end;
  members_array := string_to_array(members, ';')::integer[];
 
  insert into alpinist_summits (alpinist_id, summit_date, route_id, leader_bool, members, ascent_id)
  select m.alpinist_id,
         a.comeback_fact_time::date as comeback_date,
         a.route_id,
         m.leader_bool,
         get_ascent_members_text(m.alpinist_id, a.ascent_id),
         a.ascent_id
  from   ascents a
         inner join ascent_members m using (ascent_id)
  where  m.successfully_completed_bool and
         not exists (select 1
                     from   alpinist_summits s
                     where  s.ascent_id = a.ascent_id and
                            s.alpinist_id = m.alpinist_id) and
         m.ascent_member_id = any (members_array);
         
  update alpinist_summits
  set    members = get_ascent_members_text(alpinist_id, ascent_id)
  where  ascent_id = (select max(m.ascent_id)
                      from   ascent_members m
                      where  m.ascent_member_id = members_array[1]);
         
  return null;
end
$BODY$
  LANGUAGE plpgsql;