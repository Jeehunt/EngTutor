# EngTutor app package

# Expose routers as a namespace package for clarity
from .assistant import router as assistant_router  # noqa: F401
from .routers.words import router as words_router  # noqa: F401
from .routers.practice import router as practice_router  # noqa: F401
from .routers.maintenance import router as maintenance_router  # noqa: F401

