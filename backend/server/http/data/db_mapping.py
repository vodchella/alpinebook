mappings = {
    'summits': {
        'table_name': 'public.alpinist_summits',
        'fields': {
            'summit_id': {
                'primary_key': True,
                'db_name': 'alpinist_summit_id',
                'hashid': True
            },
            'alpinist_id': {
                'secure': True,
                'link_table': 'public.alpinists',
                'hashid': True
            },
            'summit_date': {
                'type': 'date',
                'format': '%d.%m.%Y'
            },
            'route_id': {
                'link_table': 'public.routes',
                'hashid': True
            },
            'leader': {
                'db_name': 'leader_bool'
            },
            'members': {},
            'ascent_id': {
                'link_table': 'public.ascents',
                'hashid': True
            }
        }
    }
}
