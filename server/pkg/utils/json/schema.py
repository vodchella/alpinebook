from pkg.utils.json.ref_resolver import SimpleRefResolver

schemas = {
    'alpinist_summits': {
        'id': 'alpinist_summits',
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'properties': {
            'alpinist_summit_id': {'$ref': 'schemas://field_types#/definitions/id'},
            'alpinist_id':        {'$ref': 'schemas://field_types#/definitions/id'},
            'summit_date':        {'$ref': 'schemas://field_types#/definitions/date'},
            'route_id':           {'$ref': 'schemas://field_types#/definitions/id'},
            'leader':             {'type': 'boolean'},
            'members':            {'type': 'string'}
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
            'date_time': {
                'type': 'string',
                'pattern': '^(0?[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|['
                           '0-5][0-9]):([0-9]|[0-5][0-9])$'
            },
            'date': {
                'type': 'string',
                'pattern': '^(0?[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d\d\d\d$'
            }
        }
    }
}

with SimpleRefResolver(schemas) as resolver:
    resolver.resolve(schemas['alpinist_summits'])
