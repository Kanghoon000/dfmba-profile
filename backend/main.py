"""개인 소개 과제용 FastAPI. /docs에서 API를 직접 테스트할 수 있습니다."""
import os
from datetime import datetime, timezone

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Personal Introduction API", version="1.0.0")
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip().rstrip("/") for origin in origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}


@app.get("/api/greeting", tags=["Introduction"])
def greeting(name: str = Query(default="방문자", min_length=1, max_length=40)):
    """입력한 이름으로 인사하고 서버의 현재 UTC 시간을 반환합니다."""
    cleaned = name.strip()
    return {
        "message": f"{cleaned or '방문자'}님, 개인 소개 페이지에 오신 것을 환영합니다!",
        "name": cleaned or "방문자",
        "server_time": datetime.now(timezone.utc).isoformat(),
        "service": "FastAPI on Render",
    }
