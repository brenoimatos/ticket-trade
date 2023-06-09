import sys
from typing import Any, Dict, List, Optional

from pydantic import AnyHttpUrl, BaseSettings, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "ticket_place"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 7 * 24 * 60  # 7 days
    API_PATH: str = "/api/v1"
    # The following variables need to be defined in environment

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000/", "http://localhost:3000"]
    TEST_DATABASE_URL: Optional[PostgresDsn]
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/db_fastapi"
    ASYNC_DATABASE_URL: Optional[PostgresDsn]
    GOOGLE_CLIENT_ID = "602426490845-9jjid9ons5i52f7tb5p7pghfb627294v.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    GOOGLE_STATE_SECRET = "d2a0bbed93d3caf52848430c7286bASDA1_@3e1490cfe1415334946f54600309c4b4eca"

    @validator("DATABASE_URL", pre=True)
    def build_test_database_url(cls, v: Optional[str], values: Dict[str, Any]):
        """Overrides DATABASE_URL with TEST_DATABASE_URL in test environment."""
        url = v
        if "pytest" in sys.modules:
            if not values.get("TEST_DATABASE_URL"):
                raise Exception(
                    "pytest detected, but TEST_DATABASE_URL is not set in environment"
                )
            url = values["TEST_DATABASE_URL"]
        if url:
            return url.replace("postgres://", "postgresql://")
        return url

    @validator("ASYNC_DATABASE_URL")
    def build_async_database_url(cls, v: Optional[str], values: Dict[str, Any]):
        """Builds ASYNC_DATABASE_URL from DATABASE_URL."""
        v = values["DATABASE_URL"]
        return v.replace("postgresql", "postgresql+asyncpg", 1) if v else v

    SECRET_KEY: str = "SECRET"
    #  END: required environment variables


settings_conf = Settings()