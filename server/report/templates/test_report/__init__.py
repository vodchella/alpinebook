import aiohttp
from pkg.reports import IReportTemplate
from pkg.constants import HTTP_SERVER_URL


class Report(IReportTemplate):
    _jwt = None
    _params = None

    def __init__(self, jwt, params):
        super().__init__(jwt, params)
        self._jwt = jwt
        self._params = params

    def get_title(self):
        return 'Тестовый отчёт'

    async def get_data(self):
        alpinist_id = self._params['alpinist_id'] if 'alpinist_id' in self._params else 0
        url = '%s/summits/alpinist/%s' % (HTTP_SERVER_URL, alpinist_id)
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers={'Authorization': 'Bearer ' + self._jwt}) as response:
                return await response.json()
