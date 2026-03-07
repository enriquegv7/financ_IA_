import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import mercado, global_search, auth

app = FastAPI(title="Financial Hub Clone API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all. In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(mercado.router)
app.include_router(global_search.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Financial Hub Clone API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
