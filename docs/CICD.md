# CI/CD 파이프라인 - Lootinyang

## 🚀 GitHub Actions 워크플로우

### 1. 테스트 및 빌드 워크플로우
```yaml
name: Test and Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Run TypeScript check
      run: npm run type-check
      
    - name: Run tests
      run: npm run test
      
    - name: Build project
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/
```

### 2. 배포 워크플로우
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build for production
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 3. 시큐리티 스캔 워크플로우
```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # 매주 월요일 새벽 2시

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run npm audit
      run: npm audit --audit-level moderate
      
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
```

### 4. 릴리즈 워크플로우
```yaml
name: Create Release

on:
  push:
    tags: [ 'v*' ]

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
        
    - name: Upload Release Asset
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }}
        asset_path: ./dist
        asset_name: lootinyang-build
        asset_content_type: application/zip
```

---

## 🔧 설정 파일들

### 1. GitHub Actions 워크플로우 설정
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20'
  CACHE_KEY: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  build:
    name: Build Project
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/
      - name: Deploy to Vercel
        run: echo "Deploy to Vercel"
```

### 2. Vercel 설정
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### 3. Dockerfile (선택적)
```dockerfile
# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Nginx 설정
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass https://your-api.com;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## 🔐 보안 설정

### 1. GitHub Secrets 설정
필요한 시크릿 변수들:

```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Vercel
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Security
SNYK_TOKEN=your-snyk-token

# GitHub
GITHUB_TOKEN=your-github-token
```

### 2. 환경 변수 관리
```bash
# .env.example
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

---

## 📊 모니터링 및 로깅

### 1. 성능 모니터링
```typescript
// src/utils/monitoring.ts
export const performanceMonitor = {
  // 페이지 로드 시간 측정
  measurePageLoad: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation.loadEventEnd - navigation.fetchStart;
  },

  // API 응답 시간 측정
  measureApiCall: async (apiCall: () => Promise<any>) => {
    const start = performance.now();
    const result = await apiCall();
    const end = performance.now();
    
    console.log(`API call took ${end - start} milliseconds`);
    return result;
  },
};
```

### 2. 에러 로깅
```typescript
// src/utils/errorLogger.ts
export const errorLogger = {
  log: (error: Error, context?: any) => {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    // 프로덕션에서는 외부 로깅 서비스로 전송
    if (import.meta.env.PROD) {
      // Sentry, LogRocket 등
    }
  },
};
```

---

## 🚀 배포 전략

### 1. 브랜치 전략
- `main`: 프로덕션 환경
- `develop`: 개발 환경
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 2. 배포 단계
1. **개발**: `develop` 브랜치 → 개발 서버
2. **스테이징**: `main` 브랜치 → 스테이징 서버
3. **프로덕션**: 태그 생성 → 프로덕션 서버

### 3. 롤백 전략
- 이전 버전으로 롤백
- 데이터베이스 마이그레이션 롤백
- CDN 캐시 무효화

---

## 📈 품질 관리

### 1. 코드 품질
- ESLint 규칙 준수
- TypeScript 엄격 모드
- 코드 커버리지 80% 이상

### 2. 성능 기준
- FCP (First Contentful Paint): 1.5초 이하
- LCP (Largest Contentful Paint): 2.5초 이하
- CLS (Cumulative Layout Shift): 0.1 이하

### 3. 접근성
- WCAG 2.1 AA 준수
- 키보드 내비게이션 지원
- 스크린 리더 호환

---

## 🔧 유지보수

### 1. 정기 작업
- 의존성 업데이트 (매월)
- 보안 패치 적용 (즉시)
- 성능 최적화 (분기별)

### 2. 모니터링
- 앱 성능 모니터링
- 에러 로그 확인
- 사용자 행동 분석

### 3. 백업
- 데이터베이스 백업 (일일)
- 코드 백업 (Git)
- 설정 파일 백업