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

빌드된 애플리케이션(dmg, zip, setup.exe 등)은 `out/` 디렉토리에서 확인할 수 있습니다.

## 기술 스택 (Technology Stack)

- **Electron**: 크로스 플랫폼 데스크탑 프레임워크
- **Vanilla JS**: 가벼운 코어 로직
- **CSS3**: Modern Flexbox/Grid 레이아웃 및 CSS 변수 활용

## 라이센스 (License)

ISC
