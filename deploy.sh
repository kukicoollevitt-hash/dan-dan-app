#!/bin/bash
# ===========================================
# 단단국어 자동 배포 스크립트 (Vercel 연동용)
# ===========================================

echo "🚀 단단국어 프로젝트 자동 배포를 시작합니다..."

# 1️⃣ 변경된 파일 확인
CHANGES=$(git status --porcelain)
if [ -z "$CHANGES" ]; then
  echo "✅ 변경된 파일이 없습니다. 배포를 중단합니다."
  exit 0
fi

# 2️⃣ 변경된 파일 개수 계산
COUNT=$(echo "$CHANGES" | wc -l | tr -d ' ')
echo "📦 변경된 파일 수: $COUNT"

# 3️⃣ 현재 시각 가져오기
NOW=$(date '+%Y-%m-%d %H:%M:%S')

# 4️⃣ 자동 커밋 + 푸시
echo "📤 GitHub에 변경사항을 커밋 및 푸시 중..."
git add .
git commit -m "🚀 auto deploy: $NOW ($COUNT files)"
git push origin main

# 5️⃣ 완료 안내
echo "✅ GitHub 푸시 완료!"
echo "🌐 Vercel이 자동으로 새 배포를 시작합니다 (약 30~60초 소요)."
echo "👉 확인: https://vercel.com/dashboard/project/dan-dan-app"
echo "👉 또는 직접 열기: https://dan-dan-app.vercel.app"

# 6️⃣ 종료
echo "🎉 모든 작업이 완료되었습니다!"
