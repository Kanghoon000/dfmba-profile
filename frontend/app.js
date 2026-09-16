"use strict";
const { profile, API_BASE_URL } = window.APP_CONFIG;
const byId = (id) => document.getElementById(id);
for (const [id, value] of Object.entries({ headline: profile.headline, description: profile.description, name: profile.name, initials: profile.initials, "about-text": profile.about, "footer-name": `${profile.name} / Personal Portfolio` })) {
  byId(id).textContent = value;
}
document.title = `${profile.name} | 개인 소개`;
byId("affiliation").textContent = profile.affiliation;
profile.interests.forEach((interest, index) => {
  const card = document.createElement("article");
  card.className = "interest";
  const number = document.createElement("span");
  number.textContent = `0${index + 1} / EXPLORE`;
  const title = document.createElement("h3");
  title.textContent = interest;
  card.append(number, title);
  byId("interest-list").append(card);
});
for (const [label, url] of [["연락하기 ↗", profile.email ? `mailto:${profile.email}` : ""], ["GitHub ↗", profile.github]]) {
  if (!url || !/^(https:\/\/|mailto:)/.test(url)) continue;
  const link = document.createElement("a");
  link.textContent = label;
  link.href = url;
  byId("contact").append(link);
}
const baseUrl = API_BASE_URL.replace(/\/$/, "");
byId("swagger-link").href = `${baseUrl}/docs`;
byId("greeting-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = byId("visitor-name").value.trim();
  if (!name) {
    byId("visitor-name").setCustomValidity("공백이 아닌 이름을 입력해 주세요.");
    byId("visitor-name").reportValidity();
    return;
  }
  const button = byId("submit-button");
  const status = byId("status");
  button.disabled = true;
  status.textContent = "연결 중";
  status.dataset.state = "loading";
  byId("result-message").textContent = "서버의 응답을 기다리고 있습니다.";
  byId("json-result").textContent = "요청 중…";
  byId("response-meta").textContent = "서버 시작에 시간이 걸릴 수 있습니다. 최대 90초간 기다립니다.";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  const started = performance.now();
  try {
    const url = new URL(`${baseUrl}/api/greeting`);
    url.searchParams.set("name", name);
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`서버 오류: HTTP ${response.status}`);
    const result = await response.json();
    if (typeof result.message !== "string" || typeof result.server_time !== "string") throw new Error("서버 응답 형식이 올바르지 않습니다.");
    byId("result-message").textContent = result.message;
    byId("json-result").textContent = JSON.stringify(result, null, 2);
    byId("response-meta").textContent = `HTTP ${response.status} · ${Math.round(performance.now() - started)} ms · 서버 시간 ${new Date(result.server_time).toLocaleString("ko-KR")}`;
    status.textContent = "연결 성공";
    status.dataset.state = "success";
  } catch (error) {
    status.textContent = "연결 실패";
    status.dataset.state = "error";
    byId("result-message").textContent = error.name === "AbortError" ? "응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요." : "서버에 연결하지 못했습니다.";
    byId("json-result").textContent = error.message;
    byId("response-meta").textContent = "백엔드 실행 상태, config.js의 API 주소, Render의 ALLOWED_ORIGINS 설정을 확인하세요.";
  } finally {
    clearTimeout(timer);
    button.disabled = false;
  }
});
byId("visitor-name").addEventListener("input", () => byId("visitor-name").setCustomValidity(""));
