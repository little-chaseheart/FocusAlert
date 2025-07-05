<script setup>
// 使用Vue响应式API（ref/reactive）
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFocusStore } from '@/stores/focusStore' // Pinia状态管理
import { formatTime } from '@/utils/timeUtils' // 时间格式化工具

const focusStore = useFocusStore()
const isPaused = ref(false)
const timerId = ref(null)

// 计算当前状态标题
const stateTitle = computed(() => {
  const state = focusStore.appState
  if (state === 'studying') return '专注学习中'
  if (state === 'short_rest') return '闭眼休息（10秒）'
  if (state === 'long_rest') return '长休息中（25分钟）'
  return '准备开始'
})

// 计算倒计时剩余时间（秒）
const remainingTime = computed(() => focusStore.remainingTime)

// 圆形进度条计算（可选）
const circumference = 2 * Math.PI * 45 // SVG圆周长（半径45px）
const dashOffset = computed(() => {
  const progress = 1 - remainingTime.value / focusStore.currentPhaseTotalTime
  return circumference * progress
})

// 格式化时间为“分:秒”
const formattedTime = computed(() => formatTime(remainingTime.value))

// 开始/恢复计时
const startTimer = () => {
  if (timerId.value) clearInterval(timerId.value)
  timerId.value = setInterval(() => {
    if (!isPaused.value) {
      focusStore.decrementRemainingTime()
    }
  }, 1000)
}

// 暂停/继续
const togglePause = () => {
  isPaused.value = !isPaused.value
}

// 跳过短休息
const skipShortRest = () => {
  focusStore.skipShortRest()
}

// 重置当前阶段
const resetSession = () => {
  focusStore.resetSession()
}

// 生命周期：组件挂载时启动计时
onMounted(() => {
  startTimer()
  // 请求通知权限
  focusStore.requestNotificationPermission()
})

// 生命周期：组件卸载时清理计时器
onBeforeUnmount(() => {
  if (timerId.value) clearInterval(timerId.value)
})
</script>

<template>
  <div class="focus-container">
    <!-- 状态标题 -->
    <h1>{{ stateTitle }}</h1>

    <!-- 倒计时显示 -->
    <div class="timer-container">
      <div class="progress-ring">
        <svg>
          <circle :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
        </svg>
        <span class="time-text">{{ formattedTime }}</span>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button v-if="isStudyingOrLongRest" @click="togglePause">
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button v-if="isShortRest" @click="skipShortRest">跳过休息</button>
      <button @click="resetSession">重置</button>
    </div>
  </div>
</template>

<style scoped>
/* 样式细节（如进度条颜色、按钮布局） */
.focus-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.progress-ring {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 2rem auto;
}
.time-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
}
.controls button {
  margin: 0 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}
</style>
