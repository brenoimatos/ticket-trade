import alembic.config
import uvicorn

from app.app_factory import AppFactory

app = AppFactory().create_app()

alembic_args = ["--raiseerr", "-c", "alembic.ini", "upgrade", "head"]

if __name__ == "__main__":
    alembic.config.main(argv=alembic_args)
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
