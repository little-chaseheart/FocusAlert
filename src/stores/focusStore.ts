import { defineStore } from 'pinia'
import { ref } from 'vue'

const usefocusStore = defineStore('focus', () => {
  const remainingTime = ref(10)
  let timer: number | null = null
  const minutes = ref('')
  const seconds = ref('')

  // 音频相关
  let audio: HTMLAudioElement | null = null
  let audioTimer: number | null = null

  const updateDisplay = () => {
    const mins = Math.floor(remainingTime.value / 60)
    const secs = remainingTime.value % 60
    minutes.value = String(mins).padStart(2, '0')
    seconds.value = String(secs).padStart(2, '0')
  }

  // 倒计时
  const startCounter = (timeInMinutes: number = 0.1, onComplete?: () => void) => {
    // 需要添加异步处理，不然不能添加倒计时循环
    // 停止之前的定时器
    if (timer) {
      clearInterval(timer)
      timer = null
    }

    // 设置新的倒计时时间
    remainingTime.value = timeInMinutes * 60
    updateDisplay()

    timer = setInterval(() => {
      remainingTime.value--
      if (remainingTime.value <= 0) {
        DeleteTimer()
        remainingTime.value = 0
        updateDisplay()

        // 倒计时结束时调用回调函数
        if (onComplete) {
          onComplete()
        }
      } else {
        updateDisplay()
      }
    }, 1000)
  }

  // 注销计时器
  const DeleteTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  // 播放音频
  const playAlarm = (duration: number = 5) => {
    try {
      // 创建音频对象
      audio = new Audio()

      // 设置音频源（使用内置的提示音或在线音频）
      audio.src =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'

      // 设置音频属性
      audio.loop = true
      audio.volume = 0.5

      // 播放音频
      audio
        .play()
        .then(() => {
          console.log('音频开始播放')

          // 5秒后停止音频
          audioTimer = setTimeout(() => {
            stopAlarm()
          }, duration * 1000)
        })
        .catch((error) => {
          console.error('音频播放失败:', error)
        })
    } catch (error) {
      console.error('创建音频失败:', error)
    }
  }

  // 停止音频
  const stopAlarm = () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio = null
    }

    if (audioTimer) {
      clearTimeout(audioTimer)
      audioTimer = null
    }

    console.log('音频已停止')
  }

  // 专注循环
  const smallCircle = (circletimes: number = 5) => {
    let currentRound = 1

    const startFocusRound = () => {
      if (currentRound <= circletimes) {
        console.log(`开始第${currentRound}轮专注`)

        // 专注时间结束后开始休息
        startCounter(1 / 6, () => {
          console.log('专注结束，开始休息')

          // 休息时间结束后开始下一轮
          startCounter(0.1, () => {
            console.log('休息结束')
            currentRound++
            startFocusRound() // 开始下一轮
          })
        })
      } else {
        console.log('完成所有轮次，开始25分钟休息')
      }
    }

    startFocusRound()
  }

  return {
    remainingTime,
    minutes,
    seconds,
    startCounter,
    updateDisplay,
    DeleteTimer,
    smallCircle,
    playAlarm,
    stopAlarm,
  }
})

export default usefocusStore
