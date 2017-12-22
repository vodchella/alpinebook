import asyncio
from aio_pika import connect
from aio_pika.patterns import RPC


def test(*, txt):
    print(txt)
    return 'result from printing server'


async def main(loop):
    connection = await connect("amqp://guest:guest@localhost/", loop=loop)
    channel = await connection.channel()
    rpc = await RPC.create(channel)
    await rpc.register('test', test)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))
    print(" [x] Awaiting RPC requests")
    loop.run_forever()
