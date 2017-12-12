mappings = {
    'summits': {
        'table_name': 'alpinist_summits',
        'fields': {
            'summit_id': {
                'primary_key': True,
                'db_name': 'alpinist_summit_id'
            },
            'alpinist_id': {},
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
        },
        'insert_access_rule': 'auth.check_write_access((select max(u.user_id) from auth.users u where u.alpinist_id = $%s), \'summits\')',
        'write_access_rule': 'auth.check_write_access((select max(u.user_id) from auth.users u where u.alpinist_id = t.alpinist_id), \'summits\')'
    }
}
