mappings = {
    'summits': {
        'table_name': 'alpinist_summits',
        'fields': {
            'summit_id': {
                'primary_key': True,
                'db_name': 'alpinist_summit_id'
            },
            'alpinist_id': {
                'secure': True
            },
            'summit_date': {
                'type': 'date',
                'format': '%d.%m.%Y'
            },
            'route_id': {},
            'leader': {
                'db_name': 'leader_bool'
            },
            'members': {},
            'ascent_id': {}
        }
    }
}
