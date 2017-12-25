import asyncio
from aio_pika import connect
from aio_pika.patterns import RPC
from jinja2 import Environment, select_autoescape
from pkg.reports import TemplateLoader, ReportLoader
from pkg.constants.error_codes import ERROR_REPORT_NOT_FOUND


env = None


def generate_html(*, jwt, report_name, params):
    if report_name in env.list_templates():
        template = env.get_template(report_name)
        report = ReportLoader(report_name, params, jwt)
        rendered = template.render(title=report.get_title(), data=report.get_data())
        return {'result': rendered, 'content-type': 'text/html'}
    else:
        return {'error': {'code': ERROR_REPORT_NOT_FOUND,
                          'message': 'Report doesn\'t exists'},
                'content-type': 'application/json'}


async def main(loop):
    connection = await connect("amqp://guest:guest@localhost/", loop=loop)
    channel = await connection.channel()
    rpc = await RPC.create(channel)
    await rpc.register('generate_html', generate_html)


if __name__ == '__main__':
    env = Environment(
        loader=TemplateLoader(),
        autoescape=select_autoescape(['html', 'xml'])
    )
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))
    print(" [x] Awaiting RPC requests")
    loop.run_forever()
