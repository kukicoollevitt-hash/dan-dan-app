#!/bin/bash

# 05번 단원
echo "=== 딥생물 05 ==="
echo "HTML Q3:"
grep 'name="q3"' /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_05.html | grep -o 'value="[0-9]"><span>[①②③④][^<]*' | sed 's/value="\([0-9]\)"><span>/\1: /' | head -4
echo ""
echo "JS Q3:"
grep -A 5 "deep_bio_05:" /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js | grep -A 10 "q3_opts:" | grep "'" | head -4 | sed "s/^[ ]*//" | nl
echo ""

echo "HTML Q4:"
grep 'name="q4"' /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_05.html | grep -o 'value="[0-9]"><span>[①②③④][^<]*' | sed 's/value="\([0-9]\)"><span>/\1: /' | head -4
echo ""
echo "JS Q4:"
grep -A 5 "deep_bio_05:" /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js | grep -A 20 "q4_opts:" | grep "'" | head -4 | sed "s/^[ ]*//" | nl
echo ""
echo "JS answerKey:"
grep -A 5 "deep_bio_05:" /Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js | grep "answerKey:" | head -1
echo ""
echo "========================================"
echo ""
