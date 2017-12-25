import aiohttp
import logging
from pkg.constants import APPLICATION_VERSION


async def request(url, jwt=''):
    async with aiohttp.ClientSession() as session:
        logger = logging.getLogger('report')
        logger.info('Send http request to %s' % url)
        async with session.get(url, headers={'Authorization': 'Bearer ' + jwt,
                                             'user-agent': APPLICATION_VERSION}) as r:
            return await r.json()
