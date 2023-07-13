from typing import List, Union

from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from fastapi_users import FastAPIUsers
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from app.controllers import api_router
from app.core.config import settings_conf
from app.deps.users import auth_backend, fastapi_users_obj, google_oauth_client
from app.dto.user import UserCreate, UserRead, UserUpdate


class AppFactory:
    def __init__(self):
        self.config = settings_conf
        self.description = f"{self.config.PROJECT_NAME} API"
        self.fastapi_users_obj = fastapi_users_obj
        self.app = FastAPI(
            title=self.config.PROJECT_NAME,
            openapi_url=f"{self.config.API_PATH}/openapi.json",
            description=self.description,
            redoc_url=None
        )

    def create_app(self):
        self.setup_routers(self.fastapi_users_obj)
        self.setup_cors_middleware()
        self.serve_static_app()
        return self.app

    def setup_routers(self, fastapi_users_obj: FastAPIUsers) -> None:
        
        self.app.include_router(api_router, prefix=self.config.API_PATH)
        self.app.include_router(
            fastapi_users_obj.get_oauth_router(
                google_oauth_client, auth_backend, settings_conf.GOOGLE_STATE_SECRET,
                associate_by_email=True, is_verified_by_default=True
            ),
            prefix=f"{self.config.API_PATH}/auth/google", 
            tags=["auth"]
        )
        self.app.include_router(
            fastapi_users_obj.get_auth_router(auth_backend, requires_verification=False),
            prefix=f"{self.config.API_PATH}/auth/jwt",
            tags=["auth"],
        )
        self.app.include_router(
            fastapi_users_obj.get_register_router(UserRead, UserCreate),
            prefix=f"{self.config.API_PATH}/auth",
            tags=["auth"],
        )
        self.app.include_router(
            fastapi_users_obj.get_reset_password_router(),
            prefix=f"{self.config.API_PATH}/auth",
            tags=["auth"],
        )
        self.app.include_router(
            fastapi_users_obj.get_users_router(UserRead, UserUpdate, requires_verification=False),
            prefix=f"{self.config.API_PATH}/users",
            tags=["users"],
        )
        self.use_route_names_as_operation_ids()

    def serve_static_app(self):
        self.app.mount("/", StaticFiles(directory="app/static"), name="static")

        @self.app.middleware("http")
        async def _add_404_middleware(request: Request, call_next):
            """Serves static assets on 404"""
            response = await call_next(request)
            path = request["path"]
            if path.startswith(self.config.API_PATH) or path.startswith("/docs"):
                return response
            if response.status_code == 404:
                return FileResponse("app/static/index.html")
            return response

    def setup_cors_middleware(self):
        if self.config.BACKEND_CORS_ORIGINS:
            self.app.add_middleware(
                CORSMiddleware,
                allow_origins=[str(origin) for origin in self.config.BACKEND_CORS_ORIGINS],
                allow_credentials=True,
                allow_methods=["POST", "GET", "DELETE", "PATCH"],
                expose_headers=["Content-Range", "Range", "Access-Control-Allow-Credentials"],
                allow_headers=["Authorization", "Range", "Content-Range", "Access-Control-Allow-Credentials"],
            )

    def use_route_names_as_operation_ids(self) -> None:
        """
        Simplify operation IDs so that generated API clients have simpler function
        names.

        Should be called only after all routes have been added.
        """
        route_names = set()
        for route in self.app.routes:
            if isinstance(route, APIRoute):
                if route.name in route_names:
                    raise Exception("Route function names should be unique")
                route.operation_id = route.name
                route_names.add(route.name)

