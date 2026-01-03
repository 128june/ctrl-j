# 프로젝트 실행 및 관리 가이드

이 문서는 `ctrl-j` 프로젝트를 로컬 환경(macOS)에서 실행하고 상태를 확인하는 방법을 설명합니다.

## 사전 요구 사항
- **macOS** 운영체제
- **Python 3** 설치됨 (`python3 --version` 으로 확인)
- **Node.js** (선택 사항, 프론트엔드 추가 개발 시 필요할 수 있음)

## 실행 방법

### 1. 전체 서비스 실행 (권장)
터미널에서 프로젝트 루트 디렉토리(`ctrl-j/`)로 이동 후 아래 명령어를 순서대로 실행하세요.

```bash
# 권한 부여 (최초 1회)
chmod +x scripts/deploy.sh scripts/start_backend.sh

# 프론트엔드 실행 (Port 8000)
./scripts/deploy.sh

# 백엔드 실행 (Port 8080)
./scripts/start_backend.sh
```

### 2. 서비스 접속
- **Frontend (웹 페이지)**: [http://localhost:8000](http://localhost:8000)
- **Backend (API)**: [http://localhost:8080](http://localhost:8080)

## 상태 확인 및 문제 해결

### 프로세스 확인
프로젝트가 정상적으로 실행 중인지 확인하려면 다음 파일을 참고하세요.
- `app.pid`: 프론트엔드 서버의 프로세스 ID (PID)
- `backend.pid`: 백엔드 서버의 프로세스 ID (PID)

터미널 명령어:
```bash
# 실행 중인 python(백엔드), python3(프론트엔드 http.server) 프로세스 확인
ps aux | grep python
```

### 로그 확인
실행 중 발생한 에러나 접속 기록은 다음 로그 파일에 저장됩니다.
- `app.log`: 프론트엔드 서버 로그
- `api.log`: 백엔드 서버 로그

로그 실시간 확인:
```bash
tail -f app.log api.log
```

## 서버 종료
실행 중인 서버를 종료하려면 다음 명령어를 사용하거나, PID 파일을 보고 직접 kill 할 수 있습니다.

```bash
# 백엔드 종료
kill $(cat backend.pid)

# 프론트엔드 종료
kill $(cat app.pid)
```

## 자동 실행 설정 (Auto-Start)
컴퓨터가 켜질 때마다 자동으로 프로젝트를 실행하려면 다음 단계를 따르세요.

1. **설정 파일 복사**
   터미널에서 아래 명령어를 실행하여 설정 파일을 LaunchAgents 폴더로 복사합니다.
   (어느 위치에서든 실행 가능하도록 절대 경로를 사용합니다)
   ```bash
   cp /Users/june/Project/ctrl-j/com.june.ctrl-j.plist ~/Library/LaunchAgents/
   ```

2. **자동 실행 등록**
   복사한 설정을 시스템에 등록합니다.
   ```bash
   launchctl load ~/Library/LaunchAgents/com.june.ctrl-j.plist
   ```

3. **확인**
   이제 재부팅 하거나 로그인할 때마다 자동으로 실행됩니다.
   실행 로그는 `launchd.out.log`와 `launchd.err.log`에서 확인할 수 있습니다.

### 자동 실행 해제
더 이상 자동 실행을 원하지 않을 경우:
```bash
launchctl unload ~/Library/LaunchAgents/com.june.ctrl-j.plist
rm ~/Library/LaunchAgents/com.june.ctrl-j.plist
```
