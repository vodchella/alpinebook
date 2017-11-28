CREATE OR REPLACE FUNCTION util.list_tables_sequences()
  RETURNS TABLE(table_name text, sequence_name text, max_id bigint, sequence_value bigint, is_called bool) AS
$BODY$
begin
return query execute (
  select string_agg(format('select ''%1$s''::text as table_name,
                                   ''%3$s''::text as sequence_name,
                                   max(t.%2$s)::bigint as max_id,
                                   max(s.last_value)::bigint as sequence_value,
                                   bool_and(s.is_called) as is_called
                            from   %1$s t
                                   left  join %3$s s on (1 = 1)',
                      t.table_schema || '.' || t.table_name,
                      ccu.column_name,
                      pg_get_serial_sequence(t.table_schema || '.' || t.table_name, ccu.column_name)), ' union all ')
  from   information_schema.tables t
         inner join pg_class                                     pc    on (pc.relname = t.table_name)
         left  join information_schema.table_constraints         tc using (table_name, table_schema)
         left  join information_schema.constraint_column_usage  ccu using (constraint_schema, constraint_name)
  where  t.table_schema in ('public', 'auth') and
         t.table_type = 'BASE TABLE' and
         t.table_name not in ('databasechangelog', 'databasechangeloglock') and
         tc.constraint_type = 'PRIMARY KEY'
);
end
$BODY$
  LANGUAGE plpgsql;