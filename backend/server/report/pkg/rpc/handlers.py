import logging
from sh import wkhtmltopdf
from base64 import b64encode
from pkg.reports.generator import gen_html
from pkg.utils.decorators import handle_exceptions, rpc_handler


@rpc_handler
@handle_exceptions
async def generate_html(*, jwt, report_name, params):
    return await gen_html(report_name, params, jwt)


@rpc_handler
@handle_exceptions
async def generate_pdf(*, jwt, report_name, params):
    logger = logging.getLogger('report')
    gen_result = await gen_html(report_name, params, jwt, for_pdf=True)
    if 'error' in gen_result:
        logger.info(f'PDF doesn\'t generated')
        return gen_result
    else:
        raw_pdf = wkhtmltopdf('-', '-', _in=gen_result['result']).stdout
        encoded = b64encode(raw_pdf)
        logger.info(f'PDF generated, raw size {len(raw_pdf)} bytes, encoded size {len(encoded)} bytes')
        return {'result': encoded, 'content-type': 'application/pdf_base64'}
