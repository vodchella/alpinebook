CREATE TRIGGER check_route_validity
  BEFORE INSERT OR UPDATE
  ON public.routes
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_route_validity();