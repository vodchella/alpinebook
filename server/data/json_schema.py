from pkg.utils.json.ref_resolver import SimpleRefResolver
from data.regex import REGEX_DATE, REGEX_DATETIME

schemas = {
    'alpinist_summits': {
        'id': 'alpinist_summits',
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'properties': {
            'summit_id':    {'$ref': 'schemas://field_types#/definitions/id'},
            'alpinist_id':  {'$ref': 'schemas://field_types#/definitions/id'},
            'summit_date':  {'$ref': 'schemas://field_types#/definitions/date'},
            'route_id':     {'$ref': 'schemas://field_types#/definitions/id'},
            'leader':       {'type': 'boolean'},
            'members':      {'type': 'string'}
        },
        'required': ['alpinist_id', 'summit_date', 'route_id', 'leader']
    },

    'field_types': {
        'id': 'field_types',
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'definitions': {
            'id': {
                'type': 'number',
                'minimum': 1
            },
            'datetime': {
                'type': 'string',
                'pattern': REGEX_DATETIME
            },
            'date': {
                'type': 'string',
                'pattern': REGEX_DATE
            }
        }
    }
}

with SimpleRefResolver(schemas) as resolver:
    resolver.resolve(schemas['alpinist_summits'])
