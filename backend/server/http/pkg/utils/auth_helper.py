import os
import jwt
from passlib.hash import argon2
from datetime import datetime, timedelta
from pkg.utils.decorators.singleton import singleton
from pkg.utils.strgen import StringGenerator
from pkg.app import app


@singleton
class AuthHelper:
    __secret_key = StringGenerator(r'[\p\u\d\w]{50}').render()

    def get_secret_key(self):
        return self.__secret_key

    def create_jwt_by_user(self, user):
        payload = {
            'id': user['id'],
            'name': user['name'],
            'exp': datetime.utcnow() + timedelta(hours=12)
        }

        return jwt.encode(payload, user['password'] or self.__secret_key, algorithm='HS512')

    async def get_jwt_and_user_from_request(self, request, return_encoded=False):
        user = None
        token = None
        if 'authorization' in request.headers:
            authorization = request.headers['authorization']
            if authorization[:6] == 'Bearer':
                encoded_jwt = authorization[7:]
                tmp_jwt = jwt.decode(encoded_jwt, verify=False)

                id = tmp_jwt['id'] if 'id' in tmp_jwt else 0
                if id:
                    user = await app.mongo.get_user(id)
                password = user['password'] if user and 'password' in user else None

                decoded_jwt = jwt.decode(encoded_jwt, password or self.__secret_key, algorithms='HS512')
                token = encoded_jwt if return_encoded else decoded_jwt
        return token, user

    async def get_jwt_from_request(self, request, return_encoded=False):
        result = await self.get_jwt_and_user_from_request(request, return_encoded)
        if result:
            return result[0]

    @staticmethod
    def verify_user_password(request, pswdhash, pswd_param_name='password'):
        result = False
        global_salt = os.environ['GLOBAL_SALT'] if 'GLOBAL_SALT' in os.environ else ''
        if pswd_param_name in request.raw_args:
            password = (request.raw_args[pswd_param_name] + global_salt).encode('ascii')
            if argon2.verify(password, pswdhash):
                result = True
        return result

    @staticmethod
    def get_hash_from_password(password, salt):
        global_salt = os.environ['GLOBAL_SALT'] if 'GLOBAL_SALT' in os.environ else ''
        return argon2.using(rounds=12,
                            salt=salt,
                            digest_size=128).hash((password + global_salt).encode('ascii'))
