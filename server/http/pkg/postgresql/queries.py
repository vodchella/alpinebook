#
# Имена констант должны начинаться с префикса «SQL_», тогда они будут доступны в app.db_queries
#

SQL_SET_USER_ID = """
select auth.set_user_id($1)
"""

SQL_GET_USER_ID = """
select auth.get_user_id()
"""

SQL_GET_USER_BY_PARAM = """
select json_build_object('id', coalesce(max(u.user_id), 0),
                         'name', max(u.%s),
                         'password', max(u.password),
                         'utc_created_at', to_char(max(u.created_at), 'DD.MM.YYYY HH24:MI:SS'),
                         'active', coalesce(bool_and(u.active_bool), false))
from   auth.users u
where  u.%s = $1
"""

SQL_GET_REGIONS = """
select json_build_object('region_id', r.region_id,
                         'region', r.region) as region
from   regions r
order by r.region
"""

SQL_GET_REGION = """
select get_region_json(r.region_id) as region
from   regions r
where  r.region_id = $1
"""

SQL_GET_AREAS = """
select json_build_object('area_id', a.area_id,
                         'area', a.area) as area
from   areas a
where  a.region_id = $1
order by a.area
"""

SQL_GET_AREA = """
select get_area_json(a.area_id) as area
from   areas a
where  a.area_id = $1
"""

SQL_GET_MOUNTAINS = """
select json_build_object('mountain_id', m.mountain_id,
                         'mountain', m.mountain) as mountain
from   mountains m
where  m.area_id = $1
"""

SQL_GET_MOUNTAIN = """
select get_mountain_json(m.mountain_id) as mountain
from   mountains m
where  m.mountain_id = $1
"""

SQL_GET_ROUTES = """
select json_build_object('route_id', r.route_id,
                         'route', get_route_text(r.route_id, false, true)) as mountain
from   routes r
where  r.mountain_id = $1
order by r.complexity, r.route
"""

SQL_GET_ROUTE = """
select get_route_json(rt.route_id) as mountain
from   routes rt
where  rt.route_id = $1
"""

SQL_GET_SUMMITS = """
select json_build_object('num', row_number() over (order by s.summit_date),
                         'summit_id', s.alpinist_summit_id,
                         'summit_date', to_char(s.summit_date, 'DD.MM.YYYY'),
                         'route', case
                                    when $2 = false then
                                      json_build_object('route_id', s.route_id,
                                                        'name', get_route_text(s.route_id, true, false),
                                                        'complexity', r.complexity)
                                    else
                                      get_route_json(s.route_id)
                                  end,
                         'leader', s.leader_bool,
                         'who', case
                                  when s.leader_bool then
                                    'рук.'
                                  else
                                    'уч.'
                                end,
                         'members', s.members)
from   alpinist_summits s
       inner join routes      r on (r.route_id = s.route_id)
       left  join auth.users  u on (u.alpinist_id = s.alpinist_id)
where  s.alpinist_id = $1 and
       auth.check_read_access(u.user_id, 'summits')
order by s.summit_date
"""
