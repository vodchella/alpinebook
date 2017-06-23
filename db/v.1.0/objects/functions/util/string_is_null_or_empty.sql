CREATE OR REPLACE FUNCTION util.string_is_null_or_empty(str text)
  RETURNS boolean AS
$BODY$
begin
  return coalesce(trim(str), '') = '';
end 
$BODY$
  LANGUAGE plpgsql;