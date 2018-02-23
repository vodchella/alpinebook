from pkg.utils.json.ref_resolver import SimpleRefResolver
from data.regex import REGEX_DATE, REGEX_DATETIME, REGEX_HASH_ID

schemas = {
    'summits': {
        'id': 'summits',
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'properties': {
            'summit_id':    {'$ref': 'schemas://field_types#/definitions/hash_id'},
            'alpinist_id':  {'$ref': 'schemas://field_types#/definitions/hash_id'},
            'summit_date':  {'$ref': 'schemas://field_types#/definitions/date'},
            'route_id':     {'$ref': 'schemas://field_types#/definitions/hash_id'},
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
            'hash_id': {
                'type': 'string',
                'minimum': 3,
                'pattern': REGEX_HASH_ID
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
    resolver.resolve(schemas['summits'])
