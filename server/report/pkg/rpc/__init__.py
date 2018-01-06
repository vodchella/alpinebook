import logging
from pkg.rpc import handlers


async def init_handlers(rpc):
    logger = logging.getLogger('report')
    for name, symbol in handlers.__dict__.items():
        if callable(symbol) and 'rpc_handler' in symbol.__dict__.keys():
            await rpc.register(name, symbol)
            logger.info(f'Register RPC method: {name.upper()}')
