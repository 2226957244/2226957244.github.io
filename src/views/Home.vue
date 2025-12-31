<template>
  <div class="home-container">
    <!-- Hero 区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>开悟 AI 助手</h1>
        <p class="hero-subtitle">智能对话，高效协作，开启智能办公新体验</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="startChat">
            <el-icon><Message /></el-icon> 开始对话
          </el-button>
          <el-button type="default" size="large" @click="learnMore">
            <el-icon><Document /></el-icon> 了解更多
          </el-button>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop" alt="AI 助手" />
      </div>
    </div>
    
    <!-- 功能特性 -->
    <div class="features-section">
      <div class="section-header">
        <h2>核心功能</h2>
        <p>开悟 AI 助手提供全方位的智能服务，助力您的工作效率提升</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><ChatRound /></el-icon>
          </div>
          <h3>智能对话</h3>
          <p>自然语言交互，精准理解您的需求，提供智能解决方案</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <h3>内容生成</h3>
          <p>自动生成文章、报告、代码等多种形式的内容</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <h3>数据分析</h3>
          <p>快速分析数据，生成可视化报告和洞察</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <h3>安全可靠</h3>
          <p>严格的数据安全保护机制，确保您的信息安全</p>
        </div>
      </div>
    </div>
    
    <!-- 使用场景 -->
    <div class="scenarios-section">
      <div class="section-header">
        <h2>应用场景</h2>
        <p>开悟 AI 助手适用于多种工作场景，满足您的不同需求</p>
      </div>
      <div class="scenarios-grid">
        <div class="scenario-card">
          <div class="scenario-image">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop" alt="办公场景" />
          </div>
          <div class="scenario-content">
            <h3>智能办公</h3>
            <p>自动处理邮件、日程安排、文档整理等办公事务</p>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-image">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" alt="学习场景" />
          </div>
          <div class="scenario-content">
            <h3>智能学习</h3>
            <p>提供个性化学习方案，解答疑问，辅助知识获取</p>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" alt="开发场景" />
          </div>
          <div class="scenario-content">
            <h3>智能开发</h3>
            <p>辅助代码编写、调试、优化，提高开发效率</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <h3>开悟 AI 助手</h3>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>产品</h4>
            <ul>
              <li><a href="#">功能特性</a></li>
              <li><a href="#">应用场景</a></li>
              <li><a href="#">更新日志</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4>支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">反馈建议</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4>关于</h4>
            <ul>
              <li><a href="#">公司简介</a></li>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务条款</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 开悟 AI 助手. 保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  Message, 
  Document, 
  ChatRound, 
  EditPen, 
  DataAnalysis, 
  Lock 
} from '@element-plus/icons-vue';

const router = useRouter();

// 开始对话
const startChat = () => {
  router.push('/chat');
};

// 了解更多
const learnMore = () => {
  // 这里可以添加了解更多的逻辑
  console.log('Learn more clicked');
};
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  overflow-x: hidden;
}

/* Hero 区域 */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 80px;
  background-color: $background-light;
  min-height: 600px;
  
  .hero-content {
    flex: 1;
    max-width: 600px;
    
    h1 {
      font-size: 48px;
      font-weight: 700;
      color: $text-primary;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 18px;
      color: $text-secondary;
      margin-bottom: 40px;
      line-height: 1.6;
    }
    
    .hero-actions {
      display: flex;
      gap: 20px;
      
      .el-button {
        padding: 12px 32px;
        font-size: 16px;
        border-radius: 8px;
      }
    }
  }
  
  .hero-image {
    flex: 1;
    text-align: right;
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 功能特性 */
.features-section {
  padding: 80px 60px;
  background-color: $white;
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 36px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 16px;
      color: $text-secondary;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    text-align: center;
    padding: 40px 20px;
    background-color: $background-light;
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 48px;
      color: $primary-color;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 14px;
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

/* 使用场景 */
.scenarios-section {
  padding: 80px 60px;
  background-color: $background-light;
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 36px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 16px;
      color: $text-secondary;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .scenarios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .scenario-card {
    background-color: $white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
    
    .scenario-image {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
    
    .scenario-content {
      padding: 24px;
      
      h3 {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 12px;
      }
      
      p {
        font-size: 14px;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
}

/* 页脚 */
.footer {
  background-color: $text-primary;
  color: $white;
  padding: 60px 60px 20px;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    max-width: 1200px;
    margin: 0 auto 40px;
    
    .footer-logo {
      flex: 1;
      
      h3 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
      }
    }
    
    .footer-links {
      flex: 2;
      display: flex;
      justify-content: space-between;
      
      .link-group {
        
        h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          
          li {
            margin-bottom: 10px;
            
            a {
              color: rgba(255, 255, 255, 0.8);
              text-decoration: none;
              font-size: 14px;
              transition: color 0.3s ease;
              
              &:hover {
                color: $primary-color;
              }
            }
          }
        }
      }
    }
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
    min-height: auto;
    
    .hero-content {
      margin-bottom: 40px;
      
      h1 {
        font-size: 36px;
      }
      
      .hero-subtitle {
        font-size: 16px;
      }
      
      .hero-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
  
  .features-section {
    padding: 60px 20px;
    
    .section-header {
      h2 {
        font-size: 28px;
      }
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  
  .scenarios-section {
    padding: 60px 20px;
    
    .section-header {
      h2 {
        font-size: 28px;
      }
    }
    
    .scenarios-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  
  .footer {
    padding: 40px 20px 20px;
    
    .footer-content {
      flex-direction: column;
      text-align: center;
      
      .footer-logo {
        margin-bottom: 32px;
      }
      
      .footer-links {
        flex-direction: column;
        gap: 32px;
      }
    }
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 16px;
    
    .hero-content {
      h1 {
        font-size: 28px;
      }
      
      .hero-actions {
        flex-direction: column;
        gap: 16px;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
  
  .features-section {
    padding: 40px 16px;
    
    .section-header {
      h2 {
        font-size: 24px;
      }
    }
  }
  
  .scenarios-section {
    padding: 40px 16px;
    
    .section-header {
      h2 {
        font-size: 24px;
      }
    }
  }
}
</style>