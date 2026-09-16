# 개인 소개 페이지 및 프론트엔드·백엔드 연동

HTML 개인 소개와 API 실습을 한 페이지에서 제공하는 클라우드 컴퓨팅 개인 과제입니다. 방문자가 이름을 입력하면 JavaScript가 FastAPI의 `GET /api/greeting`을 호출하고, 서버 인사와 JSON 응답·서버 시간·응답 소요 시간을 화면에 표시합니다. 방문자 이름은 저장하지 않습니다.

## 주요 구성

| 경로 | 역할 |
| --- | --- |
| `frontend/index.html` | 소개, 관심 분야, API 실습 화면 |
| `frontend/styles.css` | 모바일 대응 스타일 |
| `frontend/config.js` | 본인 소개 및 백엔드 주소 수정 |
| `frontend/app.js` | 프로필 표시, 실제 API 호출, 오류 처리 |
| `backend/main.py` | FastAPI, CORS, Swagger UI |
| `backend/requirements.txt` | 서버 의존성 |
| `backend/test_api.py` | API 입력·응답·CORS 검증 |
| `vercel.json` | 정적 프론트엔드 배포 설정 |
| `render.yaml` | Render 백엔드 배포 설정 |

프론트엔드(Vercel) → HTTP GET → 백엔드(Render/FastAPI) → JSON → 프론트엔드 화면.

## 먼저 본인 소개 수정

`frontend/config.js`의 `profile`에서 소개, 관심 분야, 이메일 및 GitHub를 수정합니다. 이름과 소속은 사용자가 제공한 **이강훈 / KAIST DFMBA 7기**로 반영했습니다. 관심 분야는 수정용 예시이며 실제 관심 분야로 확인된 내용이 아닙니다. 이메일과 GitHub는 빈 값이면 표시하지 않습니다. 제출 전에 관심 분야를 확인하고 본인의 내용으로 바꾸세요.

## 로컬 실행 (Windows PowerShell)

아래 명령은 `personal-introduction` 폴더에서 실행합니다. 가상환경 활성화 없이도 실행할 수 있습니다.

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --reload --port 8000
```

다른 PowerShell 창에서 동일한 프로젝트 폴더로 이동한 후:

```powershell
python -m http.server 5500 --directory frontend --bind 127.0.0.1
```

- 페이지: http://localhost:5500
- Swagger: http://localhost:8000/docs
- 상태 확인: http://localhost:8000/health

HTML 파일을 더블클릭하지 말고 위 HTTP 주소로 접속하세요. 이름을 입력하고 **인사 요청하기**를 누르면 연결 성공과 실제 응답이 표시됩니다. 두 서버를 종료하려면 각 창에서 `Ctrl+C`를 누릅니다.

## GitHub에 소스 올리기

GitHub에 새 저장소를 만들고, 이 `personal-introduction` 폴더의 내용을 저장소 루트에 올립니다. GitHub 웹에서 파일 업로드 기능을 사용해도 됩니다. PDF나 상위 문서 폴더 전체가 아닌 이 프로젝트만 올리세요. `.venv`, `.env`, `__pycache__`는 업로드하지 않습니다.

Git을 사용하는 경우 이 프로젝트 폴더에서:

```powershell
git init
git add .
git commit -m "Create personal introduction and FastAPI integration"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Render 백엔드 배포

1. Render에서 **New → Web Service**로 GitHub 저장소를 연결합니다.
2. Runtime은 Python, Root Directory는 `backend`로 지정합니다.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Health Check Path: `/health`
6. 환경 변수 `ALLOWED_ORIGINS`에 최종 Vercel 주소를 입력합니다. 예: `https://YOUR-PROJECT.vercel.app`. 로컬도 허용하려면 쉼표로 `http://localhost:5500,http://127.0.0.1:5500`을 추가합니다.
7. 배포 후 `https://YOUR-SERVICE.onrender.com/docs`에서 `GET /api/greeting`을 테스트합니다.

또는 저장소의 `render.yaml`을 이용한 Blueprint 배포가 가능합니다. 배포 전에 플랜을 확인하고 `ALLOWED_ORIGINS`를 입력합니다. `.env.example`은 참고용이며 자동으로 로드되지 않습니다. 실제 환경 변수는 Render에서 설정합니다.

## Vercel 프론트엔드 배포

1. `frontend/config.js`의 `API_BASE_URL`을 실제 `https://YOUR-SERVICE.onrender.com` 주소로 변경하고 GitHub에 반영합니다. `/docs`나 `/api/greeting`은 붙이지 않습니다.
2. Vercel에서 GitHub 저장소를 Import합니다.
3. Root Directory는 저장소 루트, Framework Preset은 **Other**, Output Directory는 `frontend`입니다. 빌드 명령과 설치 명령은 비워 둡니다. `vercel.json`에 정적 출력 설정이 있습니다.
4. 배포된 Vercel 주소를 Render의 `ALLOWED_ORIGINS`에 정확히 반영합니다. 프로토콜과 도메인을 포함하고 경로는 제외합니다.
5. Vercel 페이지에서 이름을 입력하고 **연결 성공**, 인사, JSON, 서버 시간이 실제로 표시되는지 확인합니다.

정적 HTML에서는 Vercel 환경 변수를 JavaScript가 자동으로 읽지 않습니다. 백엔드 주소는 반드시 `config.js`에서 수정하고 재배포합니다. Vercel 미리보기 주소가 별도라면 해당 주소도 CORS 허용 목록에 추가해야 합니다.

## 배포 주소 (배포 후 실제 값으로 수정)

| 제출 항목 | 주소 |
| --- | --- |
| GitHub 저장소 | 미배포 — 실제 저장소 주소 입력 |
| Vercel 개인 소개·API 페이지 | 미배포 — 실제 Vercel 주소 입력 |
| Render Swagger UI | 미배포 — 실제 백엔드 주소에 `/docs` 추가 |

## 검증

```powershell
.\.venv\Scripts\python.exe -m pip install httpx
.\.venv\Scripts\python.exe -m unittest discover -s backend -v
```

브라우저에서는 정상 이름, 공백 입력, 모바일 너비, 백엔드 종료 후 오류 안내를 확인합니다. 배포 완료 검증은 반드시 실제 Vercel 페이지에서 실시합니다.

연결 실패 시 `API_BASE_URL`, Render 로그, `ALLOWED_ORIGINS`를 확인하세요. HTTPS 프론트엔드에는 HTTPS 백엔드 주소를 사용합니다. 서버가 잠들어 있거나 시작 중인 경우 잠시 기다린 뒤 다시 요청하세요.

## 과제 문서에서 확인한 제출 요구

- HTML로 본인의 개인 소개 작성.
- Vercel 프론트엔드에서 Render FastAPI 호출 결과를 확인할 수 있어야 함.
- GitHub에 소스 코드 및 프로젝트 소개·주요 구성·배포 주소가 포함된 README 관리.
- GitHub 저장소, Vercel 페이지, Render Swagger UI 주소 3개 제출.
- PDF 기준 제출 기한: 9월 22일 23시 59분.
- 게시판 GitHub 주소 공유는 권장 사항이며 필수가 아님.

현재 프로젝트는 로컬 구현이며 실제 계정 배포 및 과제 제출은 완료되지 않았습니다.

## 참고 공식 문서

- [Render FastAPI 배포](https://render.com/docs/deploy-fastapi)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Vercel 설정](https://vercel.com/docs/project-configuration/vercel-json)
