<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import usefocusStore from '@/stores/focusStore'
// 引入实例
const focusStore = usefocusStore()

// 加载与注销
onMounted(() => focusStore.startCounter())
onBeforeMount(() => {
  focusStore.DeleteTimer()
})

onUnmounted(() => {
  focusStore.DeleteTimer()
})
</script>

<template>
  <div>Focus</div>
  <div>{{ focusStore.minutes }}:{{ focusStore.seconds }}</div>
</template>
