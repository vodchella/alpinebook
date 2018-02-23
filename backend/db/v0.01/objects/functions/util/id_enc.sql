CREATE OR REPLACE FUNCTION util.id_enc(
    id bigint,
    table_name text)
  RETURNS text AS
$BODY$
begin
  return hashids.hash_encode(id, '7tSW4tjicyS5izPxim4w74sg' || table_name, 3);
end
$BODY$
  LANGUAGE plpgsql;