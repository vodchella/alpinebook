import jwt
from datetime import datetime, timedelta
from pkg.utils.decorators.singleton import singleton
from pkg.utils.strgen import StringGenerator


@singleton
class AuthHelper:
    __secret_key = StringGenerator(r'[\p\u\d\w]{50}').render()

    def get_secret_key(self):
        return self.__secret_key

    def create_jwt_by_user(self, user):
        payload = {
            'id': user['id'],
            'name': user['name'],
            'exp': datetime.utcnow() + timedelta(hours=12),
            'prm': []
        }
        return jwt.encode(payload, self.__secret_key, algorithm='HS512')

    def get_session_id(self, request):
        return 'fake_session_id'  # TODO: Реализовать получение сессии из http-запроса

    async def get_user_id(self, session_id):
        return 1  # TODO: Реализовать получение текущего ID пользователя из сессии
