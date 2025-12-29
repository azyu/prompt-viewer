# Prompt Viewer (프롬프트 뷰어)

macOS와 Windows를 위해 디자인된 다크 테마의 Stable Diffusion 프롬프트 리더입니다.

![Screenshot](https://via.placeholder.com/800x600?text=Prompt+Viewer+Screenshot)

## 주요 기능 (Features)

- **드래그 앤 드롭 (Drag & Drop)**: 이미지를 앱으로 끌어놓아 간편하게 로드할 수 있습니다.
- **다양한 포맷 지원**: **PNG**, **JPEG**, **WebP** 파일에 포함된 메타데이터를 읽을 수 있습니다.
- **워크플로우 호환**: **Automatic1111** 및 **ComfyUI**로 생성된 이미지 데이터를 기본적으로 지원합니다.
- **스마트 뷰 모드 (Smart View Modes)**:
  - **Rendered (렌더링됨)**: 와일드카드 등이 처리된 최종 프롬프트를 확인합니다.
  - **Source (원본)**: 동적 태그/템플릿이 포함된 원본 입력값을 확인합니다.
- **원클릭 복사**: 긍정(Positive) 프롬프트, 부정(Negative) 프롬프트, 생성 속성(Attributes)을 버튼 하나로 복사하세요.
- **깔끔한 인터페이스**: 모던한 다크 모드 UI를 제공합니다.

## 설치 방법 (Installation)

[Node.js](https://nodejs.org/)가 설치되어 있어야 합니다.

```bash
# 저장소 복제
git clone https://github.com/azyu/prompt-viewer.git

# 디렉토리 이동
cd prompt-viewer

# 의존성 설치
npm install
```

## 사용 방법 (Usage)

### 개발 모드 실행

```bash
npm start
```

### 앱 빌드 (Build)

```bash
npm run make
```

### 자동 빌드 (GitHub Actions)

이 저장소는 **GitHub Actions**를 사용하여 다음 환경에 대한 자동 빌드를 지원합니다:

- **Windows** (`.exe`, `.zip`)
- **macOS** (`.zip`)
- **Linux** (`.deb`, `.rpm`, `.zip`)

`main` 브랜치에 푸시가 발생할 때마다 아티팩트가 생성되며, GitHub의 "Actions" 탭에서 다운로드할 수 있습니다.

## 기술 스택 (Technology Stack)

- **Electron**: 크로스 플랫폼 데스크탑 프레임워크
- **Vanilla JS**: 가벼운 코어 로직
- **CSS3**: Modern Flexbox/Grid 레이아웃 및 CSS 변수 활용

## 라이센스 (License)

ISC

## 문제 해결 (Troubleshooting)

### macOS: "앱이 손상되었거나 열 수 없습니다"

macOS에서 로컬로 빌드된 서명되지 않은 앱은 Gatekeeper에 의해 차단될 수 있습니다. 다음 명령어로 격리 속성을 제거하여 해결할 수 있습니다:

```bash
xattr -cr out/prompt-viewer-darwin-arm64/Prompt\ Viewer.app
# 또는
xattr -cr /path/to/your/Prompt\ Viewer.app
```

## 면책 조항 (Disclaimer)

이 프로젝트는 저와 **Antigravity (Gemini 3 Pro)**가 함께 만들었습니다. 따라서 아직은 프로젝트에서 최상의 코드 품질을 기대하지는 말아 주세요.

이 프로젝트는 Google의 승인을 받지 않았으며, Google 또는 Antigravity 자산의 제작 및 관리에 공식적으로 관여하는 그 누구의 견해나 의견을 반영하지 않습니다.
