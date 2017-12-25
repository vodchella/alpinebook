import asyncio
from aio_pika import connect
from aio_pika.patterns import RPC


def generate_html(*, jwt, report_name, params):
    print(report_name)
    print(params)
    print(jwt)
    print('---------------------------')
    return {'result': '<html></html><head><title>Test report</title></head><body></body>', 'content-type': 'text/html'}


async def main(loop):
    connection = await connect("amqp://guest:guest@localhost/", loop=loop)
    channel = await connection.channel()
    rpc = await RPC.create(channel)
    await rpc.register('generate_html', generate_html)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))
    print(" [x] Awaiting RPC requests")
    loop.run_forever()
