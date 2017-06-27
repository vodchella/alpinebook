#
# Имена констант должны начинаться с префикса «SQL_»
#

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
       inner join regions   r  on (r.region_id = a.region_id)
where  r.region_id = $1 and
       a.area_id = $2
"""

SQL_GET_MOUNTAINS = """
select json_build_object('mountain_id', m.mountain_id,
                         'mountain', m.mountain) as mountain
from   mountains m
       inner join areas a on (a.area_id = m.area_id)
where  a.region_id = $1 and
       m.area_id = $2
order by a.area
"""

SQL_GET_MOUNTAIN = """
select get_mountain_json(m.mountain_id) as mountain
from   mountains m
       inner join areas     a  on (a.area_id = m.area_id)
       inner join regions   r  on (r.region_id = a.region_id)
where  r.region_id = $1 and
       a.area_id = $2 and
       m.mountain_id = $3
"""

SQL_GET_ROUTES = """
select json_build_object('route_id', r.route_id,
                         'route', get_route_text(r.route_id)) as mountain
from   routes r
       inner join mountains  m on (m.mountain_id = r.mountain_id)
       inner join areas      a on (a.area_id = m.area_id)
       left  join mountains em on (em.mountain_id = r.ending_mountain_id)
where  a.region_id = $1 and
       m.area_id = $2 and
       r.mountain_id = $3
order by r.complexity, r.route
"""
