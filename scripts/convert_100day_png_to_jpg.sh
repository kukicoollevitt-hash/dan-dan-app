#!/bin/bash
# 100day 이미지 폴더 png → jpg 변환 (원본 png 삭제)
# 사용법:
#   bash scripts/convert_100day_png_to_jpg.sh           # 품질 75 (기본)
#   bash scripts/convert_100day_png_to_jpg.sh 65        # 품질 65 (더 작게)
#   bash scripts/convert_100day_png_to_jpg.sh 75 all    # 기존 jpg도 재압축
set -e

DIR="/Users/dandan/Desktop/brainmoon_academy0428/public/images/100day"
QUALITY="${1:-75}"     # 기본 75 (없으면 75)
INCLUDE_JPG="${2:-}"   # "all" 지정 시 기존 jpg도 재압축

if [ ! -d "$DIR" ]; then
  echo "폴더 없음: $DIR"
  exit 1
fi

shopt -s nullglob 2>/dev/null || true
new=0
recompressed=0
skip=0
saved=0

# 1) PNG → JPG
for png in "$DIR"/*.png "$DIR"/*.PNG; do
  [ -e "$png" ] || continue
  base="${png%.*}"
  jpg="${base}.jpg"
  src_size=$(stat -f%z "$png" 2>/dev/null || wc -c < "$png")

  if [ -f "$jpg" ]; then
    echo "스킵: $(basename "$png") · 같은 이름 jpg 존재"
    skip=$((skip+1))
    continue
  fi

  sips -s format jpeg -s formatOptions "$QUALITY" "$png" --out "$jpg" > /dev/null
  if [ ! -f "$jpg" ]; then
    echo "실패: $(basename "$png")"
    continue
  fi

  dst_size=$(stat -f%z "$jpg" 2>/dev/null || wc -c < "$jpg")
  saved=$((saved + src_size - dst_size))
  rm "$png"
  echo "새로 변환: $(basename "$png") -> $(basename "$jpg") · $((src_size/1024))KB -> $((dst_size/1024))KB"
  new=$((new+1))
done

# 2) 옵션: 기존 jpg 재압축
if [ "$INCLUDE_JPG" = "all" ]; then
  for jpg in "$DIR"/*.jpg "$DIR"/*.JPG; do
    [ -e "$jpg" ] || continue
    tmp="${jpg%.*}.tmp.jpg"
    src_size=$(stat -f%z "$jpg" 2>/dev/null || wc -c < "$jpg")
    sips -s format jpeg -s formatOptions "$QUALITY" "$jpg" --out "$tmp" > /dev/null
    if [ ! -f "$tmp" ]; then continue; fi
    dst_size=$(stat -f%z "$tmp" 2>/dev/null || wc -c < "$tmp")
    if [ "$dst_size" -lt "$src_size" ]; then
      saved=$((saved + src_size - dst_size))
      mv "$tmp" "$jpg"
      echo "재압축: $(basename "$jpg") · $((src_size/1024))KB -> $((dst_size/1024))KB"
      recompressed=$((recompressed+1))
    else
      rm "$tmp"
    fi
  done
fi

echo ""
echo "--- 요약 (품질 $QUALITY) ---"
echo "새로 변환: $new개"
[ "$recompressed" -gt 0 ] && echo "재압축: $recompressed개"
[ "$skip" -gt 0 ] && echo "스킵: $skip개"
[ "$saved" -gt 0 ] && echo "용량 절감: 약 $((saved/1024))KB (약 $((saved/1024/1024))MB)"
