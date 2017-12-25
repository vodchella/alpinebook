import os
import posixpath
import importlib
from jinja2 import BaseLoader, TemplateNotFound
from jinja2.utils import open_if_exists
from abc import ABCMeta, abstractmethod


class IReportTemplate:
    __metaclass__ = ABCMeta

    def __init__(self, jwt, params):
        """Not implemented"""

    @abstractmethod
    async def get_data(self):
        """Not implemented"""

    @abstractmethod
    def get_title(self):
        """Not implemented"""


class TemplateLoader(BaseLoader):
    def __init__(self):
        pass

    def get_source(self, environment, template):
        filename = 'templates/%s/template.html' % template
        f = open_if_exists(filename)
        if f:
            try:
                contents = f.read().decode('utf-8')
            finally:
                f.close()

            mtime = posixpath.getmtime(filename)

            def uptodate():
                try:
                    return posixpath.getmtime(filename) == mtime
                except OSError:
                    return False

            return contents, filename, uptodate

        raise TemplateNotFound(template)

    def list_templates(self):
        walk_dir = os.walk('templates', followlinks=True)
        for dirpath, dirnames, filenames in walk_dir:
            return sorted(dirnames)


class ReportLoader(IReportTemplate):
    _jwt = None
    _params = None
    _report_name = None
    _report = None

    def _init_report_class(self):
        report = importlib.import_module('templates.' + self._report_name)
        self._report = report.Report(self._jwt, self._params)

    def __init__(self, report_name, params, jwt):
        super().__init__(jwt, params)
        self._jwt = jwt
        self._params = params
        self._report_name = report_name
        self._init_report_class()

    def get_title(self):
        if self._report:
            return self._report.get_title()

    async def get_data(self):
        if self._report:
            return await self._report.get_data()
