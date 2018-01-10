import os
import jwt
from passlib.hash import argon2
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
            'exp': datetime.utcnow() + timedelta(hours=12)
        }
        return jwt.encode(payload, self.__secret_key, algorithm='HS512')

    def get_jwt_from_request(self, request, return_encoded=False):
        if 'authorization' in request.headers:
            authorization = request.headers['authorization']
            if authorization[:6] == 'Bearer':
                encoded_jwt = authorization[7:]
                decoded_jwt = jwt.decode(encoded_jwt, self.__secret_key, algorithms='HS512')
                return encoded_jwt if return_encoded else decoded_jwt

    @staticmethod
    def verify_user_password(request, pswdhash):
        result = False
        global_salt = os.environ['GLOBAL_SALT'] if 'GLOBAL_SALT' in os.environ else ''
        password = (request.raw_args['password'] + global_salt).encode('ascii')
        # hash = argon2.using(rounds=12,
        #                     salt=user['utc_created_at'].encode('utf-8'),
        #                     digest_size=128).hash(password)
        if argon2.verify(password, pswdhash):
            result = True
        return result
