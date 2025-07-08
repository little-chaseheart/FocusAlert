<script setup>
import usefocusStore from '@/stores/focusStore'
const focusStore = usefocusStore()
</script>
<template>
  <div class="container">
    <div class="breathing-circle"></div>
  </div>
</template>

<style scoped>
/* 容器样式用于居中演示 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.breathing-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #6356ba; /* Vue经典绿色 */
  position: relative; /* 为绝对定位的子元素提供参照 */
  /* 动画配置 */
  animation: breath 2s ease-in-out infinite;
}

.circle-num {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
  /* pointer-events: none; 避免影响点击动画 */
  user-select: none;
}

/* 定义呼吸动画 */
@keyframes breath {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
