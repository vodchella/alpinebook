import jsonschema
from jsonschema.exceptions import ValidationError
from data.json_schema import schemas
from pkg.utils.decorators.singleton import singleton
from pkg.utils.errors import response_error, ERROR_SCHEMA_VALIDATION


@singleton
class Validator:
    def validate(self, json_object, schema_name):
        try:
            self.validate_and_raise_error(json_object, schema_name)
        except ValidationError as e:
            return response_error(ERROR_SCHEMA_VALIDATION, e.message)

    def validate_and_raise_error(self, json_object, schema_name):
        jsonschema.validate(json_object, schemas[schema_name])
