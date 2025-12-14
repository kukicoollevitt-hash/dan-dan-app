#!/bin/bash

for i in {05..20}; do
  file="/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_${i}.html"
  if [ -f "$file" ]; then
    echo "=== deep_bio_${i} Q3 ==="
    grep 'name="q3"' "$file" | sed 's/.*value="\([0-9]\)"><span>\([^<]*\)<.*/\1: \2/' | head -4
    echo ""
    echo "=== deep_bio_${i} Q4 ==="
    grep 'name="q4"' "$file" | sed 's/.*value="\([0-9]\)"><span>\([^<]*\)<.*/\1: \2/' | head -4
    echo ""
    echo "---"
  fi
done
