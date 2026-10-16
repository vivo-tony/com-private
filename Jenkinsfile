// Jenkins 声明式流水线：代码合并到 main 后，自动构建并发布到私有 npm。
// 触发方式：GitLab 里配置 webhook（Merge Request 合并事件）→ 通知 Jenkins 构建。
pipeline {
  agent any

  environment {
    // TODO: 替换成公司私有 npm 源地址（与 .npmrc 保持一致）
    NPM_REGISTRY = 'https://npm.your-company.com/'
    // TODO: 替换成你的 GitLab 仓库地址（用于升版本后回写提交）
    GIT_REPO = 'https://gitlab.your-company.com/your-group/mas-center.git'
  }

  stages {
    stage('检出') {
      steps { checkout scm }
    }

    stage('安装依赖') {
      steps {
        sh 'corepack enable'
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('构建') {
      steps { sh 'pnpm build' }
    }

    stage('升版本') {
      // 按 changeset 自动升版本 + 生成 changelog，并回写仓库。
      // 提交信息带 [skip ci]，Jenkins 里勾选「忽略含 [skip ci] 的提交」可避免循环触发。
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'git-credential',   // Jenkins 里配置的 GitLab 账号/Token 凭证
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_TOKEN'
        )]) {
          sh '''
            git config user.name "jenkins"
            git config user.email "jenkins@your-company.com"
            pnpm changeset version
            git add .
            git commit -m "chore: version packages [skip ci]" || true
            git push "https://${GIT_USER}:${GIT_TOKEN}@${GIT_REPO#https://}" HEAD:main || true
          '''
        }
      }
    }

    stage('发布到私有 npm') {
      steps {
        withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
          // .npmrc 里已写 @mas:registry 指向私有源，并引用 ${NPM_TOKEN}
          sh 'pnpm changeset publish'
        }
      }
    }
  }
}
