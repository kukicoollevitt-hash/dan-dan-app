#!/bin/bash

for unit in 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20; do
  line=$(grep -n "deep_bio_${unit}:" /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js | head -1 | cut -d: -f1)
  echo "Unit $unit: Line $line"
done
