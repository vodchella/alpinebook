from pkg.reports import IReportTemplate
from pkg.constants import HTTP_SERVER_URL
from pkg.utils.http import request


class Report(IReportTemplate):
    _jwt = None
    _params = None

    def __init__(self, jwt, params):
        super().__init__(jwt, params)
        self._jwt = jwt
        self._params = params

    def get_title(self):
        return 'Учётная карточка альпиниста'

    async def get_data(self, **options):
        alpinist_id = self._params['alpinist_id'] if 'alpinist_id' in self._params else 0
        url = f'{HTTP_SERVER_URL}/api/v1/summits/alpinist/{alpinist_id}'
        rows = await request(url, self._jwt)
        return {'rows': rows,
                'server_url': HTTP_SERVER_URL if 'for_pdf' in options and options['for_pdf'] else ''}
