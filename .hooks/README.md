# Git Hooks 가이드

## 설정 방법

### 초기 설정 (필수)
```bash
# Git hooks 경로 설정
git config core.hooksPath .hooks

# Hook 스크립트에 실행 권한 부여
chmod +x .hooks/*
```

## prepare-commit-msg Hook
커밋 메시지에 JIRA 이슈 번호를 자동으로 검증합니다.

### 동작 방식
- 현재 브랜치 이름에서 JIRA ID를 추출 (예: INPLACE-123)
- 커밋 메시지에 해당 JIRA ID가 포함되어 있는지 검사
- merge 커밋은 검사에서 제외
- JIRA ID가 없으면 커밋이 중단됨

### 사용 예시
```bash
# 올바른 커밋 메시지 (성공)
git commit -m "INPLACE-123 로그인 기능 구현"

# 잘못된 커밋 메시지 (실패)
git commit -m "로그인 기능 구현"
```

## 문제 해결

### Hook이 실행되지 않는 경우
```bash
# 실행 권한 확인
ls -l .hooks/prepare-commit-msg

# 권한 부여
chmod +x .hooks/prepare-commit-msg
```

### 권한 부여 후에도 동작하지 않는 경우
1. Git hooks 경로가 올바르게 설정되었는지 확인
```bash
git config --get core.hooksPath
```

2. 스크립트 실행 권한 다시 부여
```bash
chmod +x .hooks/*
```

---