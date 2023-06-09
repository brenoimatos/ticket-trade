import uuid

from fastapi import Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (AuthenticationBackend,
                                          BearerTransport, CookieTransport,
                                          JWTStrategy)
from fastapi_users.manager import BaseUserManager, UUIDIDMixin
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from httpx_oauth.clients.google import GoogleOAuth2
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings_conf
from app.deps.db import get_async_session
from app.models.user import OAuthAccount
from app.models.user import User as UserModel

bearer_transport = BearerTransport(tokenUrl=f"{settings_conf.API_PATH}/auth/jwt/login")
cookie_transport = CookieTransport(
    cookie_max_age=3600,
    cookie_name='cookie-ticket',
    cookie_secure=True,
    cookie_samesite='none',
    cookie_httponly=False
)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings_conf.SECRET_KEY,
        lifetime_seconds=settings_conf.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


google_oauth_client = GoogleOAuth2(settings_conf.GOOGLE_CLIENT_ID, settings_conf.GOOGLE_CLIENT_SECRET)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)


class UserManager(UUIDIDMixin, BaseUserManager[UserModel, uuid.UUID]):
    reset_password_token_secret = settings_conf.SECRET_KEY
    verification_token_secret = settings_conf.SECRET_KEY

    # async def on_after_register(self, user: User, request: Optional[Request] = None):
    #     print(f"User {user.id} has registered.")

    # async def on_after_forgot_password(
    #     self, user: User, token: str, request: Optional[Request] = None
    # ):
    #     print(f"User {user.id} has forgot their password. Reset token: {token}")

    # async def on_after_request_verify(
    #     self, user: User, token: str, request: Optional[Request] = None
    # ):
    #     print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, UserModel, OAuthAccount)

def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users_obj = FastAPIUsers(get_user_manager, [auth_backend])

current_user = fastapi_users_obj.current_user(active=True)
current_superuser = fastapi_users_obj.current_user(active=True, superuser=True)
