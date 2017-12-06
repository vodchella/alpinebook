CREATE OR REPLACE FUNCTION auth.check_self_id_not_in_exceptions()
  RETURNS trigger AS
$BODY$
begin
  case
    when new.user_id is not null and new.user_id = any(new.read_access_except) then
      raise exception 'Сам пользователь не может присутствовать в списке исключений';
    else
      return new;
  end case;
end
$BODY$
  LANGUAGE plpgsql;