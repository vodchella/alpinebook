from pkg.utils.decorators.handle_exceptions import handle_exceptions


class Mongo:
    __conn = None
    __db = None
    __users = None

    def __init__(self, conn):
        self.__conn = conn
        self.__db = conn['alpinebook']
        self.__users = self.__db['users']
        self.__users.create_index('email', unique=True, background=True)

    async def upsert_user(self, user):
        await self.__users.replace_one({'name': user['name']}, user, upsert=True)

    async def get_user(self, id):
        return await self.__users.find_one({'id': id})
