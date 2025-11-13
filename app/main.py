from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
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
app.include_router(assistant_router, prefix="/api")
app.include_router(words_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(maintenance_router, prefix="/api")


@app.get("/")
def index_redirect():
    """Сделать страницу словаря главной"""
    return RedirectResponse(url="/words", status_code=status.HTTP_302_FOUND)


@app.get("/settings")
def settings_page(request: Request):
    accept = (request.headers.get("accept") or "").lower()
    if "application/json" in accept:
        from fastapi.responses import JSONResponse
        return JSONResponse({"message": "Settings endpoint"})
    return templates.TemplateResponse("settings.html", {"request": request})

# Routes for words/practice/maintenance moved to dedicated routers

