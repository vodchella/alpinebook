CREATE OR REPLACE FUNCTION public.on_ascent_complete_cancelation()
  RETURNS trigger AS
$BODY$
begin
  delete from alpinist_summits s
  where  s.alpinist_id = new.alpinist_id and
         s.ascent_id = new.ascent_id;
         
  update alpinist_summits
  set    members = get_ascent_members_text(alpinist_id, ascent_id)
  where  ascent_id = new.ascent_id;
         
  return new;
end
$BODY$
  LANGUAGE plpgsql;