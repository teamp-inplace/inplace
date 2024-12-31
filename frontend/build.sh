#!/bin/sh

# output 디렉토리 생성
mkdir -p ../output

# frontend 디렉토리의 내용을 output으로 복사
cp -R ./* ../output/

# 디버깅을 위한 디렉토리 구조 출력
ls -la ../output/