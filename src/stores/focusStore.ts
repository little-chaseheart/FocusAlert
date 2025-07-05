import { defineStore } from 'pinia'
import { ref } from 'vue'

const usefocusStore = defineStore('focus', () => {
  const remainingTime = ref(300)
  let timer: number | null = null
  const minutes = ref('')
  const seconds = ref('')

  const updateDisplay = () => {
    const mins = Math.floor(remainingTime.value / 60)
    const secs = remainingTime.value % 60
    minutes.value = String(mins).padStart(2, '0')
    seconds.value = String(secs).padStart(2, '0')
  }

  // 倒计时
  const startCounter = () => {
    // 停止之前的定时器
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    updateDisplay()

    timer = setInterval(() => {
      remainingTime.value--
      if (remainingTime.value <= 0) {
        DeleteTimer()
        remainingTime.value = 0
        updateDisplay()
      } else {
        updateDisplay()
      }
    }, 1000)
  }

  // 重设时间
  const setTimeAndStart = (timeInMinutes: number) => {
    // 先设置时间，再开始倒计时
    remainingTime.value = timeInMinutes * 60
    startCounter()
  }

  // 注销计时器
  const DeleteTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  return {
    remainingTime,
    minutes,
    seconds,
    startCounter,
    setTimeAndStart,
    updateDisplay,
    DeleteTimer,
  }
})

export default usefocusStore
