CREATE OR REPLACE FUNCTION public.fill_rank()
  RETURNS trigger AS
$BODY$
begin
  if new.alpinist_rank is null then
    select a.rank
    into   new.alpinist_rank
    from   alpinists a
    where  a.alpinist_id = new.alpinist_id;
  end if;
  return new;
end 
$BODY$
  LANGUAGE plpgsql;