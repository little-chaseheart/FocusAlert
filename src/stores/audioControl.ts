import { defineStore } from 'pinia'

const useAudioStore = defineStore('alert', () => {
  // 音频相关
  let audio: HTMLAudioElement | null = null
  let audioTimer: number | null = null

  // 预加载音频
  const preloadAudio = () => {
    if (!audio) {
      audio = new Audio()
      // 使用相对路径
      audio.src = '/src/assets/闹钟声音1.mp3'
      audio.preload = 'auto'

      // 监听加载事件
      audio.addEventListener('canplaythrough', () => {
        console.log('音频预加载完成')
      })

      audio.addEventListener('error', (e) => {
        console.error('音频加载错误:', e)
        // 如果相对路径失败，尝试其他路径
        tryAlternativePaths()
      })
    }
  }

  // 尝试其他路径
  const tryAlternativePaths = () => {
    if (!audio) return

    const paths = [
      './src/assets/闹钟声音1.mp3',
      '../assets/闹钟声音1.mp3',
      'assets/闹钟声音1.mp3',
      '/assets/闹钟声音1.mp3',
    ]

    let currentIndex = 0

    const tryNextPath = () => {
      if (currentIndex >= paths.length) {
        console.error('预加载：所有音频路径失败')
        return
      }

      audio!.src = paths[currentIndex]
      currentIndex++

      audio!.addEventListener(
        'error',
        () => {
          tryNextPath()
        },
        { once: true },
      )

      audio!.addEventListener(
        'canplaythrough',
        () => {
          console.log('预加载：找到可用的音频路径:', audio!.src)
        },
        { once: true },
      )
    }

    tryNextPath()
  }

  // 播放音频
  const playAlarm = (duration: number = 5, onComplete?: () => void) => {
    try {
      // 确保音频已预加载
      preloadAudio()

      if (!audio) {
        console.error('音频对象创建失败')
        if (onComplete) onComplete()
        return
      }

      // 设置音频属性
      audio.loop = true
      audio.volume = 0.5

      // 播放音频
      audio
        .play()
        .then(() => {
          console.log('音频开始播放')

          // 按时后停止音频
          audioTimer = setTimeout(() => {
            stopAlarm()
            if (onComplete) {
              onComplete()
            }
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

  return {
    playAlarm,
    stopAlarm,
    preloadAudio,
  }
})

export default useAudioStore
