from datetime import datetime
from data.db_mapping import mappings
from pkg.utils.json.validator import Validator
from pkg.app import app


class QueryBuilder:
    _table_name = None
    _primary_key = None
    _map = None
    _validate_json = False

    def __init__(self, resource_name, validate_json=False):
        self._map = mappings[resource_name]
        self._table_name = self._map['table_name']
        self._validate_json = validate_json
        self._primary_key = self._get_primary_key()

    def _get_primary_key(self):
        primary_key = ''
        for fld in self._map['fields'].items():
            field = fld[1]
            field_name = field['db_name'] if 'db_name' in field else fld[0]
            primary_key = field_name if 'primary_key' in field and field['primary_key'] else primary_key
            if primary_key:
                break
        return primary_key

    def _get_fields(self, json_object):
        if self._validate_json:
            Validator().validate_and_raise_error(json_object, self._table_name)
        fields = []
        out_values = []
        in_values = [v for v in json_object.values()]
        access_field_num = 0
        for (i, f_name) in enumerate(json_object.keys(), start=0):
            field = self._map['fields'][f_name]
            field_name = field['db_name'] if 'db_name' in field else f_name
            if field_name == 'alpinist_id':
                access_field_num = i + 1
            field_type = field['type'] if 'type' in field else None
            field_format = field['format'] if 'format' in field else None
            if field_type in ['date', 'datetime']:
                field_value = datetime.strptime(in_values[i], field_format)
            else:
                field_value = in_values[i]
            fields.append(field_name)
            out_values.append(field_value)
        if 'write_access_rule' in self._map:
            secure_sql = ('with secure as (%s)' % self._map['write_access_rule']) % access_field_num
        else:
            secure_sql = None
        return {'fields': fields,
                'primary_key': self._primary_key,
                'access_field_number': access_field_num,
                'secure_sql': secure_sql,
                'values': out_values}

    def generate_insert(self, json_object, secure=True):
        fields = self._get_fields(json_object)
        ret = 'returning %s' % fields['primary_key'] if fields['primary_key'] else ''
        vals = ', '.join(['$%s' % i for (i, v) in enumerate(fields['values'], start=1)])
        if secure:
            sql = fields['secure_sql'] + '\ninsert into %s (%s)\nselect %s\nfrom   secure %s\n' % (self._table_name,
                                                                                                   ', '.join(
                                                                                                     fields['fields']),
                                                                                                   vals, ret)
        else:
            sql = 'insert into %s (%s)\nvalues (%s) %s' % (self._table_name, ', '.join(fields['fields']), vals, ret)
        return {'sql': sql, 'values': fields['values']}

    def generate_update(self, json_object, secure=True):
        fields_data = self._get_fields(json_object)
        pk = fields_data['primary_key']
        fields_names = [n for (i, n) in enumerate(fields_data['fields']) if n != pk]
        fields_values = [v for (i, v) in enumerate(fields_data['values']) if fields_data['fields'][i] != pk]
        cols = ', '.join(['%s = $%s' % (fields_names[i], i + 2) for (i, v) in enumerate(fields_names)])
        if secure:
            sql = fields_data['secure_sql'] + app.db_queries['secure_update_template'] % \
                  (self._table_name, cols, pk)
        else:
            sql = 'with rows as (update %s set %s where %s = $1 returning 1) select count(*) from rows\n' % \
                  (self._table_name, cols, pk)
        return {'sql': sql, 'values': fields_values}

    def generate_delete(self):
        sql = 'with rows as (delete from %s where %s = $1 returning 1) select count(*) from rows\n' % \
              (self._table_name, self._primary_key)
        return {'sql': sql}
