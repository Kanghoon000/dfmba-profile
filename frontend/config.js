// Render 배포 후 실제 백엔드 주소로 바꾸고 Vercel에 다시 배포하세요.
window.APP_CONFIG = {
  API_BASE_URL: "http://localhost:8000",
  profile: {
    name: "이강훈",
    affiliation: "KAIST DFMBA 7기",
    initials: "KH",
    headline: "안녕하세요,\nDFMBA 7기 이강훈입니다.",
    description: "KAIST DFMBA 7기 이강훈입니다. 개인 소개 페이지에 방문해 주셔서 감사합니다.",
    about: "클라우드 컴퓨팅 실습 과제로 개인 소개 페이지와 FastAPI 백엔드를 연결했습니다. 아래 실습에서 이름을 입력하면 서버가 보내는 인사를 확인할 수 있습니다.",
    interests: ["금융 · 비즈니스", "데이터 분석", "클라우드 컴퓨팅"],
    email: "", // 공개할 이메일을 입력하면 연락하기 링크가 나타납니다.
    github: "" // https://github.com/사용자명
  }
};
