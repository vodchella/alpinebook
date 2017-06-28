#  Основано на https://github.com/purukaushik/ref-resolver

import jsonpath_rw
from urllib.parse import urlparse


class SimpleRefResolver:
    _json_obj = None
    _schemas = None

    def __init__(self, schemas=None):
        self._schemas = schemas

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def _resolve(self, json_obj):
        if isinstance(json_obj, dict):
            for key, value in json_obj.items():
                if key == '$ref':
                    ref_frag = urlparse(value)

                    if ref_frag.scheme == 'schemas' and self._schemas:
                        json_dump = self._schemas[ref_frag.netloc]
                    else:
                        json_dump = self._json_obj

                    ref_path_expr = '$' + '.'.join(ref_frag.fragment.split('/'))
                    path_expression = jsonpath_rw.parse(ref_path_expr)
                    list_of_values = [match.value for match in path_expression.find(json_dump)]
                    if len(list_of_values) > 0:
                        resolution = list_of_values[0]
                        return resolution
                resolved = self._resolve(value)
                if resolved is not None:
                    json_obj[key] = resolved
        elif isinstance(json_obj, list):
            for (key, value) in enumerate(json_obj):
                resolved = self._resolve(value)
                if resolved is not None:
                    json_obj[key] = resolved
        return None

    def resolve(self, json_obj):
        self._json_obj = json_obj
        self._resolve(json_obj)
