import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://engtutor:engtutor@localhost:5432/engtutor",
)


engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_models():
    """Инициализация моделей - создание таблиц, если их ещё нет.
    
    Примечание: Для миграций схемы БД используйте Alembic:
    alembic revision --autogenerate -m "description"
    alembic upgrade head
    """
    from . import models  # noqa: F401
    # Создаём таблицы, если их ещё нет
    # В production используйте Alembic для миграций
    Base.metadata.create_all(bind=engine)


