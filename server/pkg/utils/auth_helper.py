from pkg.utils.decorators import singleton


@singleton
class AuthHelper:
    def get_session_id(self, request):
        return 'fake_session_id'  # TODO: Реализовать получение сессии из http-запроса

    async def get_user_id(self, session_id):
        return 1  # TODO: Реализовать получение текущего ID пользователя из сессии
