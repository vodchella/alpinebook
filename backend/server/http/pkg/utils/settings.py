import os
import importlib
import importlib.util


def _import_one_file(file_path):
    full_path_to_module = os.path.expanduser(file_path)
    module_dir, module_file = os.path.split(full_path_to_module)
    module_name, module_ext = os.path.splitext(module_file)
    spec = importlib.util.spec_from_file_location(module_name, full_path_to_module)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def load_config(config_path):
    return _import_one_file(config_path)
