from datetime import datetime
from data.db_mapping import mappings
from pkg.utils.json.validator import Validator


class QueryBuilder:
    _table_name = None
    _map = None
    _validate_json = False

    def __init__(self, table_name, validate_json=False):
        self._table_name = table_name
        self._map = mappings[table_name]
        self._validate_json = validate_json

    def _get_fields(self, json_object):
        if self._validate_json:
            Validator().validate_and_raise_error(json_object, self._table_name)
        primary_key = ''
        for fld in self._map['fields'].items():
            field = fld[1]
            field_name = field['db_name'] if 'db_name' in field else fld[0]
            primary_key = field_name if 'primary_key' in field and field['primary_key'] else primary_key
            if primary_key:
                break
        fields = []
        out_values = []
        in_values = [v for v in json_object.values()]
        for (i, f_name) in enumerate(json_object.keys()):
            field = self._map['fields'][f_name]
            field_name = field['db_name'] if 'db_name' in field else f_name
            field_type = field['type'] if 'type' in field else None
            field_format = field['format'] if 'format' in field else None
            if field_type in ['date', 'datetime']:
                field_value = datetime.strptime(in_values[i], field_format)
            else:
                field_value = in_values[i]
            fields.append(field_name)
            out_values.append(field_value)
        return {'fields': fields, 'primary_key': primary_key, 'values': out_values}

    def generate_insert(self, json_object):
        fields = self._get_fields(json_object)
        ret = 'returning %s' % fields['primary_key'] if fields['primary_key'] else ''
        vals = ', '.join(['$%s' % i for (i, v) in enumerate(fields['values'], start=1)])
        sql = 'insert into %s (%s) values (%s) %s;' % (self._table_name, ', '.join(fields['fields']), vals, ret)
        return {'sql': sql, 'values': fields['values']}
