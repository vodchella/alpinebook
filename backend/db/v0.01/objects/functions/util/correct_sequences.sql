CREATE OR REPLACE FUNCTION util.correct_sequences()
  RETURNS integer AS
$BODY$
declare
  i    record;
  r    integer := 0;
begin
  for i in (select format('select setval(''%1$s'', %2$s);', t.sequence_name, t.max_id)::text as sql_command
            from   util.list_tables_sequences() t
            where  t.max_id is not null and
                   t.sequence_value is not null and
                   (t.max_id > t.sequence_value or (not t.is_called and t.sequence_value = 1))) loop
    execute i.sql_command;
    r := r + 1;
  end loop;
  return r;
end
$BODY$
  LANGUAGE plpgsql;