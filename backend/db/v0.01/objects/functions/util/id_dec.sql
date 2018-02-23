CREATE OR REPLACE FUNCTION util.id_dec(
    encoded_id text,
    table_name text)
  RETURNS bigint AS
$BODY$
begin
  return hash_decode(encoded_id, '7tSW4tjicyS5izPxim4w74sg' || table_name, 3);
end
$BODY$
  LANGUAGE plpgsql;