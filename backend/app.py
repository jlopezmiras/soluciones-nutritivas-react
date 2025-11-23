# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from api.library_routes import router as library_router
from api.solution_manager_routes import router as manager_router
from api.solution_manager_manual_routes import router as manager_manual_router
from api.tanks_routes import router as tanks_router

def create_app() -> FastAPI:
    app = FastAPI(title="My Project")

    # CORS, middleware, etc.
    origins = [
        "http://localhost:5173",
        "localhost:5173"
        ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # include routers
    app.include_router(library_router, prefix="/library", tags=["library"])
    app.include_router(manager_router, prefix="/manager", tags=["manager"])
    app.include_router(manager_manual_router, prefix="/manager/manual", tags=["manager_manual"])
    app.include_router(tanks_router, prefix="/reparto", tags=["reparto"])

    # startup hook for DB migrations / table creation (if desired)
    @app.on_event("startup")
    def on_startup():
        # create tables (for simple cases). In prod, prefer migrations (alembic).
        Base.metadata.create_all(bind=engine)

    return app

# single exported app instance
app = create_app()
