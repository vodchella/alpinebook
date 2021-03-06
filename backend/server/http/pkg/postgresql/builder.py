from datetime import datetime
from data.db_mapping import mappings
from pkg.utils.json.validator import Validator


class QueryBuilder:
    _resource_name = None
    _table_name = None
    _primary_key = None
    _primary_key_hashid = False
    _map = None
    _validate_json = False

    def __init__(self, resource_name, validate_json=False):
        self._resource_name = resource_name
        self._map = mappings[resource_name]
        self._table_name = self._map['table_name']
        self._validate_json = validate_json
        self._primary_key, self._primary_key_hashid = self._get_primary_key()

    def _get_primary_key(self):
        primary_key = ''
        for fld in self._map['fields'].items():
            field = fld[1]
            field_name = field['db_name'] if 'db_name' in field else fld[0]
            primary_key = field_name if 'primary_key' in field and field['primary_key'] else primary_key
            if primary_key:
                break
        return primary_key, field['hashid'] if 'hashid' in field else False

    def _get_secure_sqls(self, access_field, access_field_num):
        access_sql = """auth.check_write_access((select max(u.user_id)
                                  from   auth.users u
                                  where  u.alpinist_id = %s),
                                 '""" + self._resource_name + '\')'
        access_insert_sql = access_sql % 'util.id_dec($%s, \'public.alpinists\')'
        access_write_sql = access_sql % ('t.%s' % access_field)
        secure_insert_sql = ('with secure as (\n  select 1\n  where  %s\n)' % access_insert_sql) % access_field_num
        secure_write_sql = 'and\n         %s' % access_write_sql
        return secure_insert_sql, secure_write_sql

    def _get_fields(self, json_object):
        if self._validate_json:
            Validator().validate_and_raise_error(json_object, self._table_name)

        fields = []
        out_values = []
        in_values = [v for v in json_object.values()]
        access_field = ''
        access_field_num = 0
        secure_insert_sql = ''
        secure_write_sql = ''

        for (i, f_name) in enumerate(json_object.keys(), start=0):
            field = self._map['fields'][f_name]
            field_name = field['db_name'] if 'db_name' in field else f_name
            if field['secure'] if 'secure' in field else False:
                access_field = field_name
                access_field_num = i + 1
            field_type = field['type'] if 'type' in field else None
            field_format = field['format'] if 'format' in field else None
            if field_type in ['date', 'datetime']:
                field_value = datetime.strptime(in_values[i], field_format)
            else:
                field_value = in_values[i]
            fields.append(field_name)
            out_values.append(field_value)

        if access_field_num:
            secure_insert_sql, secure_write_sql = self._get_secure_sqls(access_field, access_field_num)

        return {'fields': fields,
                'primary_key': self._primary_key,
                'access_field': access_field,
                'access_field_number': access_field_num,
                'secure_insert_sql': secure_insert_sql,
                'secure_write_sql': secure_write_sql,
                'values': out_values}

    def _gen_val(self, fields_data, num, for_update=False):
        def map_name_by_db_name(db_name):
            names = self._map['fields'].keys()
            if db_name in names:
                return db_name
            else:
                for (i, f) in enumerate(self._map['fields'].values()):
                    if 'db_name' in f and f['db_name'] == db_name:
                        return list(names)[i]
        val = f'${num + 1 if for_update else num}'
        field_name = map_name_by_db_name(fields_data['fields'][num - 1])
        field = self._map['fields'][field_name]
        if 'hashid' in field and field['hashid']:
            link_table = field['link_table'] if 'link_table' in field else self._table_name
            val = f'util.id_dec({val}, \'{link_table}\')'
        return val

    def generate_insert(self, json_object, secure=True):
        fields = self._get_fields(json_object)
        ret = 'returning hash_id' if self._primary_key_hashid else 'returning %s' % \
            fields['primary_key'] if fields['primary_key'] else ''
        vals = ', '.join([self._gen_val(fields, i) for (i, v) in enumerate(fields['values'], start=1)])
        if secure:
            sql = fields['secure_insert_sql'] + \
                  '\ninsert into %s (%s)\nselect %s\nfrom   secure\n%s\n' % \
                  (self._table_name, ', '.join(fields['fields']), vals, ret)
        else:
            sql = '\ninsert into %s (%s)\nvalues (%s) %s' % (self._table_name, ', '.join(fields['fields']), vals, ret)
        return {'sql': sql, 'values': fields['values']}

    def generate_update(self, json_object, secure=True):
        fields_data = self._get_fields(json_object)
        pk = fields_data['primary_key']
        fields_names = [n for (i, n) in enumerate(fields_data['fields']) if n != pk]
        fields_values = [v for (i, v) in enumerate(fields_data['values']) if fields_data['fields'][i] != pk]
        cols = ',\n         '.join(['%s = %s' % (fields_names[i - 1], self._gen_val(fields_data, i, True)) for (i, v) in enumerate(fields_names, start=1)])
        secure_sql = fields_data['secure_write_sql'] if secure else ''
        where = f'util.id_dec($1, \'{self._table_name}\')' if self._primary_key_hashid else '$1'
        sql_with = f'with r as (\n  update {self._table_name} t\n  set    {cols} \n  where  {pk} = {where} {secure_sql}\n  returning 1\n)'
        sql = '\n%s\nselect count(*) from r\n' % sql_with
        return {'sql': sql, 'values': fields_values}

    def generate_delete(self, secure=True):
        secure_sql = ''
        if secure:
            fields = self._map['fields']
            fields_names = list(fields)
            arr = [fields_names[i] for i, f in enumerate(fields.values(), start=0)
                   if 'secure' in f and f['secure']]
            secure_field_name = arr[0] if len(arr) else ''
            if secure_field_name:
                _, secure_sql = self._get_secure_sqls(secure_field_name, 0)
        where = f'util.id_dec($1, \'{self._table_name}\')' if self._primary_key_hashid else '$1'
        sql = f'\nwith r as (\n  delete from {self._table_name} t\n  where  {self._primary_key} = {where} {secure_sql}\n  returning 1\n)\nselect count(*) from r\n'
        return {'sql': sql}
