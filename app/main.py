import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from .database import init_models
from .assistant import router as assistant_router
from .routers.words import router as words_router
from .routers.practice import router as practice_router
from .routers.maintenance import router as maintenance_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_models()
    yield
    # Shutdown (если нужно что-то закрыть)


app = FastAPI(title="EngTutor", lifespan=lifespan)
templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Production: монтирование frontend/dist для статики
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

app.include_router(assistant_router, prefix="/api")
app.include_router(words_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(maintenance_router, prefix="/api")


@app.get("/")
def index_redirect():
    """SPA fallback или редирект на /words"""
    # Если есть frontend/dist, отдаем index.html (SPA)
    if frontend_dist.exists() and (frontend_dist / "index.html").exists():
        return FileResponse(str(frontend_dist / "index.html"))
    # Иначе редирект на /words
    return RedirectResponse(url="/words", status_code=status.HTTP_302_FOUND)


@app.get("/settings")
def settings_page(request: Request):
    accept = (request.headers.get("accept") or "").lower()
    if "application/json" in accept:
        from fastapi.responses import JSONResponse
        return JSONResponse({"message": "Settings endpoint"})
    # SPA fallback для production
    if frontend_dist.exists() and (frontend_dist / "index.html").exists():
        return FileResponse(str(frontend_dist / "index.html"))
    return templates.TemplateResponse("settings.html", {"request": request})


# SPA fallback: все GET запросы не начинающиеся с /api отдаем index.html
@app.get("/{path:path}")
def spa_fallback(path: str, request: Request):
    """SPA fallback для Vue Router"""
    # Пропускаем API запросы
    if path.startswith("api"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Not found")
    
    # Если есть frontend/dist, отдаем index.html
    if frontend_dist.exists() and (frontend_dist / "index.html").exists():
        return FileResponse(str(frontend_dist / "index.html"))
    
    # Иначе 404
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Not found")

# Routes for words/practice/maintenance moved to dedicated routers

