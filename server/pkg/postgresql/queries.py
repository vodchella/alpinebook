#
# Имена констант должны начинаться с префикса «SQL_»
#

SQL_GET_REGIONS = """
select json_build_object('region_id', r.region_id,
                         'region', r.region) as region
from   regions r
order by r.region_id
"""

SQL_GET_REGION = """
select json_build_object('region_id', r.region_id,
                         'region', max(r.region),
                         'areas', array_agg(case
                                              when a.area_id is not null then
                                                json_build_object('area_id', a.area_id, 'area', a.area)
                                            end)) as region
from   regions r
       left join areas a  on (a.region_id = r.region_id)
where  r.region_id = $1
group by r.region_id
"""
