#!/bin/sh

# 전체 프로젝트를 복사할 output 디렉토리 생성
mkdir -p ../output

# 현재 프로젝트의 모든 디렉토리를 output으로 복사
cp -R ../../* ../output/

# frontend 디렉토리의 최신 내용으로 업데이트
rm -rf ../output/frontend/*  # frontend 디렉토리 내용을 비우고
cp -R ./* ../output/frontend/  # 현재 frontend 내용을 복사

# 디버깅을 위한 디렉토리 구조 출력
ls -la ../output/