from pkg.reports.generator import gen_html
from pkg.utils.decorators import handle_exceptions, rpc_handler


@rpc_handler
@handle_exceptions
async def generate_html(*, jwt, report_name, params):
    return await gen_html(report_name, params, jwt)


@rpc_handler
@handle_exceptions
async def generate_pdf(*, jwt, report_name, params):
    return await gen_html(report_name, params, jwt, for_pdf=True)
