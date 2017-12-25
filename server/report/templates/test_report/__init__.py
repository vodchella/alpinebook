from pkg.reports import IReportTemplate


class Report(IReportTemplate):
    _jwt = None
    _params = None

    def __init__(self, jwt, params):
        super().__init__(jwt, params)
        self._jwt = jwt
        self._params = params

    def get_title(self):
        return 'Тестовый отчёт'

    def get_data(self):
        #  Просто тестовые данные
        return [{
            'leader': False,
            'summit_date': '02.01.2017',
            'route': {
                'name': 'Амангельды 2Б В гребень',
                'route_id': 2
            },
            'members': 'Разные люди +1',
            'summit_id': 666
        }, {
            'leader': True,
            'summit_date': '01.01.2017',
            'route': {
                'name': 'Амангельды 1Б с запада',
                'route_id': 1
            },
            'members': 'Разные люди',
            'summit_id': 2
        }]
