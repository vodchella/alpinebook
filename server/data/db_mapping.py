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
        'write_access_rule': """
            select 1
            from   auth.users u
            where  u.alpinist_id = $%s and
                   auth.check_write_access(u.user_id, 'summits')
            """
    }
}
