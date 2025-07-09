import { defineStore } from 'pinia'
import useAudioStore from './audioControl'
import { computed, ref } from 'vue'
import { getRandomTimes } from '@/utils/timeUtils'

const usefocusStore = defineStore('focus', () => {
  const audioStore = useAudioStore()
  //定义单次学习时间
  const minTime = ref(3)
  const maxTime = ref(5)
  const remainingTime = ref(0)
  let timer: number | null = null //定义时钟对象
  const minutes = ref('')
  const seconds = ref('')
  //定义休息时间
  const longRest = ref(25)
  const shortRest = ref(1 / 12)
  //定义单次循环次数、当前第几次循环
  const circletimes = computed(() => Math.floor(180 / (minTime.value + maxTime.value)))
  let currentRound = 1
  //定义当前状态，学习中、缓口气、休憩
  const statement = ref('Rest')
  //暂停标签. 暂停true, 不是暂停false
  const isPause = ref(false)
  //开始标签
  const isStart = ref(false)

  const updateDisplay = () => {
    const mins = Math.floor(remainingTime.value / 60)
    const secs = remainingTime.value % 60
    minutes.value = String(mins).padStart(2, '0')
    seconds.value = String(secs).padStart(2, '0')
  }

  // 倒计时
  const Counter = (timeInMinutes: number = 0.1, onComplete?: () => void) => {
    // 需要添加异步处理，不然不能添加倒计时循环
    // 停止之前的定时器
    if (timer) {
      clearInterval(timer)
      timer = null
    }

    // 设置新的倒计时时间
    if (!isPause.value) {
      remainingTime.value = timeInMinutes * 60
    } // 不是暂停false就重设
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

  // 单次全流程循环
  const FocusRound = () => {
    if (currentRound <= circletimes.value) {
      console.log(`开始第${currentRound}轮专注`)
      statement.value = 'Focus'
      remainingTime.value = getRandomTimes(minTime.value, maxTime.value)
      // 专注时间结束后播放音频，音频播放完成后再开始休息
      Counter(remainingTime.value / 60, () => {
        statement.value = 'Breathing'
        audioStore.playAlarm()
        // 音频播放,开始休息
        Counter(1 / 6, () => {
          console.log('休息结束，播放音频')
          audioStore.playAlarm()
          currentRound++
          FocusRound() // 开始下一轮
        })
      })
    } else {
      console.log('完成所有轮次,开始25分钟休息')
      statement.value = 'Rest'
      Counter(25, () => {
        audioStore.playAlarm(undefined, () => console.log('大休息结束，可以开始下一轮学习了！'))
      })
    }
  }

  // 开始循环
  const startCircle = () => {
    isStart.value = true
    isPause.value = false

    currentRound = 1
    FocusRound()
  }

  // 暂停循环
  const pauseCircle = () => {
    isPause.value = true
    DeleteTimer()
  }
  // 继续循环
  const resumeCircle = () => {
    isPause.value = false
    Counter(remainingTime.value / 60, () => {
      currentRound++
      audioStore.playAlarm(undefined, () => FocusRound())
    })
  }

  // 重置
  const reset = () => {
    isStart.value = false
    statement.value = 'Rest'
    DeleteTimer()
    remainingTime.value = 0
    updateDisplay()
  }

  return {
    remainingTime,
    minutes,
    seconds,
    circletimes,
    currentRound,
    statement,
    isStart,
    isPause,
    minTime,
    maxTime,
    Counter,
    updateDisplay,
    DeleteTimer,
    startCircle,
    pauseCircle,
    resumeCircle,
    reset,
  }
})

export default usefocusStore
