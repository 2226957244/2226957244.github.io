<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content-wrapper">
        <div class="hero-content">
          <h1>开悟 AI 助手</h1>
          <p class="hero-description">
            智能对话、专业解答、高效协作，为您提供全方位的AI服务体验
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="goChat">
              <el-icon><ChatDotRound /></el-icon>
              立即开始聊天
            </el-button>
            <el-button type="default" size="large" @click="scrollToFeatures">
              <el-icon><ArrowDown /></el-icon>
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero-image">
          <el-card shadow="hover">
            <img 
              src="https://images.unsplash.com/photo-1677442136988-7770f91749b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="AI Assistant" 
              class="hero-img"
            />
          </el-card>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" ref="featuresRef">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <el-card class="feature-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon class="feature-icon"><ChatSquare /></el-icon>
                <span>智能对话</span>
              </div>
            </template>
            <div class="card-content">
              <p>自然语言交互，理解您的需求，提供精准的回答和建议</p>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon class="feature-icon"><Document /></el-icon>
                <span>内容生成</span>
              </div>
            </template>
            <div class="card-content">
              <p>快速生成文章、报告、代码等多种形式的内容</p>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon class="feature-icon"><PieChart /></el-icon>
                <span>数据分析</span>
              </div>
            </template>
            <div class="card-content">
              <p>处理和分析数据，提供可视化报告和洞察</p>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon class="feature-icon"><Lock /></el-icon>
                <span>安全可靠</span>
              </div>
            </template>
            <div class="card-content">
              <p>严格的数据加密和隐私保护，确保信息安全</p>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 开悟 AI 助手. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChatDotRound, 
  ArrowDown, 
  ChatSquare, 
  Document, 
  PieChart, 
  Lock 
} from '@element-plus/icons-vue'

const router = useRouter()
const featuresRef = ref<HTMLElement | null>(null)

const goChat = () => {
  router.push({ name: 'Chat' })
}

const scrollToFeatures = () => {
  if (featuresRef.value) {
    featuresRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.hero {
  background-color: #f0f9ff;
  padding: 60px 0;
  flex: 1;

  .hero-content-wrapper {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .hero-content {
    flex: 1;

    h1 {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      color: $text-primary;
    }

    .hero-description {
      font-size: 18px;
      color: $text-regular;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
  }

  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .hero-img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      max-height: 400px;
      object-fit: cover;
    }
  }
}

/* Features Section */
.features {
  padding: 60px 0;
  background-color: $bg-color;

  .section-title {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 40px;
    color: $text-primary;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .feature-card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: $box-shadow-lg;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;

      .feature-icon {
        font-size: 24px;
        color: $primary-color;
      }

      span {
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .card-content {
      padding-top: 16px;
      color: $text-regular;
      line-height: 1.6;
    }
  }
}

/* Footer */
.footer {
  background-color: $card-bg;
  padding: 24px 0;
  border-top: 1px solid $border-color;
  margin-top: auto;

  p {
    text-align: center;
    color: $text-secondary;
    font-size: 14px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 40px 0;

    .hero-content-wrapper {
      flex-direction: column;
      gap: 24px;
    }

    .hero-content {
      h1 {
        font-size: 36px;
      }

      .hero-description {
        font-size: 16px;
      }

      .hero-actions {
        justify-content: center;
      }
    }
  }

  .features {
    padding: 40px 0;

    .section-title {
      font-size: 28px;
    }
  }
}

@media (max-width: 480px) {
  .hero .hero-content h1 {
    font-size: 28px;
  }

  .features .section-title {
    font-size: 24px;
  }
}
</style>
