#!/bin/bash

for i in 07 08 09; do
  echo "=== deep_bio_${i} Q3 ==="
  grep 'name="q3"' "/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_${i}.html" | grep -o 'value="[0-9]"><span>[^<]*' | sed 's/value="\([0-9]\)"><span>/\1: /' | head -4
  echo ""
  echo "=== deep_bio_${i} Q4 ==="
  grep 'name="q4"' "/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_${i}.html" | grep -o 'value="[0-9]"><span>[^<]*' | sed 's/value="\([0-9]\)"><span>/\1: /' | head -4
  echo ""
done
