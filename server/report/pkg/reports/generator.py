import logging
import pkg
from pkg.constants.error_codes import ERROR_REPORT_NOT_FOUND
from pkg.reports import ReportLoader
from pkg.utils.errors import response_error


async def gen_html(report_name, params, jwt):
    logger = logging.getLogger('report')
    if report_name in pkg.env.list_templates():
        template = pkg.env.get_template(report_name)
        report = ReportLoader(report_name, params, jwt)
        title = report.get_title()
        logger.info(f'Get data for report \'{report_name}\' ({title})')
        data = await report.get_data()
        if 'error' in data:
            return response_error(data['error']['code'], data['error']['message'])
        rendered = await template.render_async(title=title, data=data)
        logger.info(f'Rendered HTML:\n{rendered}\n')
        return {'result': rendered, 'content-type': 'text/html'}
    else:
        return response_error(ERROR_REPORT_NOT_FOUND, f'Report \'{report_name}\' doesn\'t exists')
