<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import usefocusStore from '@/stores/focusStore'
import useAudioStore from '@/stores/audioControl'
import breathingCircle from './breathing-circle.vue'
// 引入实例
const focusStore = usefocusStore()
const audioStore = useAudioStore()

// 加载与注销
onMounted(() => focusStore.updateDisplay())
onBeforeMount(() => {
  focusStore.DeleteTimer()
})

onUnmounted(() => {
  focusStore.DeleteTimer()
})

// 状态处理函数
const getStatusText = (status) => {
  const statusMap = {
    Rest: '准备开始',
    Focus: '专注学习中',
    Breathing: '休息中',
  }
  return statusMap[status] || status
}

// 状态标签
const getStatusClass = (status) => {
  const classMap = {
    Rest: 'status-rest',
    Focus: 'status-focus',
    Breathing: 'status-breathing',
  }
  return classMap[status] || 'status-default'
}

// 倒计时、动画切换
const showBreathing = ref(false)
</script>

<template>
  <div class="app-container">
    <!-- 美观的 Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">FocusAlert</h1>
          <div class="status-info">
            <span class="status-label">当前状态：</span>
            <span class="status-value" :class="getStatusClass(focusStore.statement)">
              {{ getStatusText(focusStore.statement) }}
            </span>
            <span class="status-label">循环次数：</span>
            <span class="status-value status-rest">
              {{ focusStore.circletimes }}
            </span>
          </div>
        </div>

        <div class="header-right">
          <div class="settings-panel">
            <!-- <div class="setting-group">
              <label class="setting-label">循环次数</label>
              <el-input-number
                v-model="focusStore.circletimes"
                :min="1"
                :max="10"
                size="small"
                class="setting-input"
              />
            </div> -->

            <div class="setting-group">
              <label class="setting-label">专注时长范围</label>
              <div class="time-range-inputs">
                <el-input-number
                  v-model="focusStore.minTime"
                  :min="1"
                  :max="focusStore.maxTime - 1"
                  size="small"
                  class="time-input"
                  placeholder="最小"
                  :disabled="focusStore.isStart"
                />
                <span class="time-separator">~</span>
                <el-input-number
                  v-model="focusStore.maxTime"
                  :min="focusStore.minTime + 1"
                  :max="30"
                  size="small"
                  class="time-input"
                  placeholder="最大"
                  :disabled="focusStore.isStart"
                />
                <span class="time-unit">分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="focus-container">
      <div class="timer-display" @click="showBreathing = !showBreathing">
        <el-tooltip content="点击切换动画 / 倒计时">
          <div v-if="!showBreathing" class="time">
            {{ focusStore.minutes }}:{{ focusStore.seconds }}
          </div>
          <breathing-circle v-else />
        </el-tooltip>
      </div>

      <!-- 控制按钮 -->
      <div class="button-controls">
        <!-- 开始/重置按钮组 -->
        <button v-if="!focusStore.isStart" class="play-btn" @click="focusStore.startCircle()">
          开始
        </button>
        <el-tooltip v-else :content="`当前是第${focusStore.currentRound}轮`">
          <button class="stop-btn" @click="focusStore.reset()">重置</button>
        </el-tooltip>

        <!-- 暂停/继续按钮组 - 只在开始后才显示 -->
        <button
          v-if="focusStore.isStart && !focusStore.isPause"
          class="pause-btn"
          @click="focusStore.pauseCircle()"
        >
          暂停
        </button>
        <button
          v-else-if="focusStore.isStart && focusStore.isPause"
          class="resume-btn"
          @click="focusStore.resumeCircle()"
        >
          继续
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体容器 */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* Header 样式 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.status-value {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-rest {
  background: #e3f2fd;
  color: #1976d2;
}

.status-focus {
  background: #fff3e0;
  color: #f57c00;
}

.status-breathing {
  background: #e8f5e8;
  color: #388e3c;
}

.status-default {
  background: #e3f2fd;
  color: #666;
}

/* 设置面板 */
.settings-panel {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
  background: rgba(245, 245, 255, 0.7);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.08);
  padding: 18px 28px;
  margin-top: 8px;
}

.setting-group {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 140px;
  transition: box-shadow 0.2s;
}
.setting-group:hover {
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.18);
}

.setting-label {
  font-size: 1rem;
  color: #5f5f7a;
  font-weight: 600;
  margin-bottom: 4px;
}

.setting-input {
  width: 80px;
}

.time-range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  width: 70px;
}

.time-separator {
  color: #666;
  font-weight: 500;
}

.time-unit {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

/* 主要内容区域 */
.focus-container {
  max-width: 600px;
  margin: 9ch auto;
  padding: 40px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.focus-container h2 {
  margin: 0 0 30px 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.timer-display {
  margin: 40px 0;
  height: 120px; /* 保证切换时白框高度不变 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.time {
  font-size: 4.5rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

.button-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.play-btn,
.stop-btn,
.pause-btn,
.resume-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 100px;
}

.play-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.stop-btn {
  background: linear-gradient(135deg, #dc3545, #e74c3c);
  color: white;
}

.pause-btn {
  background: linear-gradient(135deg, #ffc107, #ffb300);
  color: #212529;
}

.resume-btn {
  background: linear-gradient(135deg, #17a2b8, #20c997);
  color: white;
}

.play-btn:hover,
.stop-btn:hover,
.pause-btn:hover,
.resume-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .settings-panel {
    justify-content: center;
  }

  .app-title {
    font-size: 1.5rem;
  }

  .time {
    font-size: 3rem;
  }

  .audio-controls {
    flex-direction: column;
    align-items: center;
  }

  .play-btn,
  .stop-btn,
  .pause-btn,
  .resume-btn {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 15px 0;
  }

  .focus-container {
    margin: 20px auto;
    padding: 30px 15px;
  }

  .time {
    font-size: 2.5rem;
  }
}
</style>
