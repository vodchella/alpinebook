#
# Имена констант должны начинаться с префикса «SQL_», тогда они будут доступны в app.db_queries
#

SQL_SET_USER_ID = """
select auth.set_user_id($1)
"""

SQL_GET_USER_ID = """
select auth.get_user_id()
"""

SQL_UPDATE_USER_PASSWORD = """
with rows as (
  update auth.users
  set    password = $1
  where  user_id = $2
  returning 1
)
select count(*)
from   rows
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
select json_build_object('id', r.hash_id,
                         'name', r.region) as region
from   regions r
order by r.region
"""

SQL_GET_REGION = """
select get_region_json(r.region_id) as region
from   regions r
where  r.hash_id = $1
"""

SQL_GET_AREAS = """
select json_build_object('id', a.hash_id,
                         'name', a.area) as area
from   areas a
       inner join regions r using (region_id)
where  r.hash_id = $1
order by a.area
"""

SQL_GET_AREA = """
select get_area_json(a.area_id) as area
from   areas a
where  a.hash_id = $1
"""

SQL_GET_MOUNTAINS = """
select json_build_object('id', m.hash_id,
                         'name', m.mountain) as mountain
from   mountains m
       inner join areas a using (area_id)
where  a.hash_id = $1
"""

SQL_GET_MOUNTAIN = """
select get_mountain_json(m.mountain_id) as mountain
from   mountains m
where  m.hash_id = $1
"""

SQL_GET_ROUTES = """
select case
         when r.winter_complexity is not null then
           json_build_object('id', r.hash_id,
                             'name', get_route_text(r.route_id, false, false),
                             'complexity', r.complexity,
                             'winter_complexity', r.winter_complexity)
         else
           json_build_object('id', r.hash_id,
                             'name', get_route_text(r.route_id, false, false),
                             'complexity', r.complexity)
       end as route
from   routes r
       inner join mountains m using (mountain_id)
where  m.hash_id = $1
order by r.complexity, r.route
"""

SQL_GET_ROUTE = """
select get_route_json(rt.route_id) as route
from   routes rt
where  rt.hash_id = $1
"""

SQL_GET_SUMMITS = """
select json_build_object('num', row_number() over (order by s.summit_date),
                         'id', s.hash_id,
                         'summit_date', to_char(s.summit_date, 'DD.MM.YYYY'),
                         'route', case
                                    when $2 = false then
                                      json_build_object('route_id', r.hash_id,
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
       inner join alpinists   a using (alpinist_id)
       inner join routes      r on (r.route_id = s.route_id)
       left  join auth.users  u on (u.alpinist_id = s.alpinist_id)
where  a.hash_id = $1 and
       auth.check_read_access(u.user_id, 'summits')
order by s.summit_date
"""

SQL_SEARCH_MOUNTAINS = """
with recursive r1 as (
  select distinct
         region as path,
         region_id as id,
         region as name,
         'r' as type
  from   mounts

  union all

  select distinct
         r1.path || '->' || m.area as path,
         m.area_id as id,
         m.area as name,
         'a' as type
  from   mounts m
         inner join r1 on (m.region_id = r1.id and r1.type = 'r')
),
r2 as (
  select *
  from   r1

  union all

  select r2.path || '->' || m.mountain as path,
         m.mountain_id as id,
         m.mountain as name,
         'm' as type
  from   mounts m
         inner join r2 on (m.area_id = r2.id and r2.type = 'a')
),
mounts as (
  select m.hash_id as mountain_id,
         m.mountain,
         a.hash_id as area_id,
         a.area,
         r.hash_id as region_id,
         r.region
  from   mountains m
         inner join areas    a using (area_id)
         inner join regions  r using (region_id)
  where  m.mountain ~* $1 and
         a.hash_id = case
                       when $2 = false then
                         a.hash_id
                       else
                         $3
                     end
)
select json_build_object('t', r2.type,
                         'id', r2.id,
                         'name', r2.name)
from   r2
order by path
"""
