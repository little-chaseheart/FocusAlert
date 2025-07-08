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
  background-color: #42b983; /* Vue经典绿色 */

  /* 动画配置 */
  animation: breath 2s ease-in-out infinite;
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
