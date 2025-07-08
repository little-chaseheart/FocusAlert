<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import usefocusStore from '@/stores/focusStore'
import useAudioStore from '@/stores/audioControl'
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
</script>

<template>
  <div class="header">
    <p>循环次数：{{ focusStore.circletimes }}</p>
    <p>当前状态：{{ focusStore.statement }}</p>
    <!-- 调试信息 -->
    <p>isStart: {{ focusStore.isStart }}, isPause: {{ focusStore.isPause }}</p>
  </div>
  <div class="focus-container">
    <h2>专注计时器</h2>
    <div class="timer-display">
      <div class="time">{{ focusStore.minutes }}:{{ focusStore.seconds }}</div>
    </div>

    <!-- 音频控制按钮 -->
    <div class="audio-controls">
      <!-- 开始/重置按钮组 -->
      <button v-if="!focusStore.isStart" class="play-btn" @click="focusStore.startCircle()">
        开始
      </button>
      <button v-else class="stop-btn" @click="focusStore.reset()">重置</button>

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
</template>

<style scoped>
.focus-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.timer-display {
  margin: 30px 0;
}

.time {
  font-size: 4rem;
  font-weight: bold;
  font-family: monospace;
  color: #333;
}

.audio-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.play-btn,
.stop-btn,
.pause-btn,
.resume-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.play-btn {
  background: #28a745;
  color: white;
}

.stop-btn {
  background: #dc3545;
  color: white;
}

.pause-btn {
  background: #ffc107;
  color: #212529;
}

.resume-btn {
  background: #17a2b8;
  color: white;
}

.play-btn:hover,
.stop-btn:hover,
.pause-btn:hover,
.resume-btn:hover {
  opacity: 0.8;
}
</style>
