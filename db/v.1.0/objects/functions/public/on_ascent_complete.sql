CREATE OR REPLACE FUNCTION public.on_ascent_complete()
  RETURNS trigger AS
$BODY$
declare
  members   text;
  separator varchar(1) := ';';
begin
  begin 
    members := current_setting('alpinebook.members_who_complited_ascent');
  exception
    when others then
      members := '';
  end;
  if util.string_is_null_or_empty(members) then
    separator := '';     
  end if;
  members := members || separator || new.ascent_member_id::text;
  perform set_config('alpinebook.members_who_complited_ascent', members, true);
  return new;
end
$BODY$
  LANGUAGE plpgsql;