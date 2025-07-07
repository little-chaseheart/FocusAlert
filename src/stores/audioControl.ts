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
        console.error('所有音频路径都失败了')
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
          console.log('找到可用的音频路径:', audio!.src)
        },
        { once: true },
      )
    }

    tryNextPath()
  }

  // 播放音频
  const playAlarm = (duration: number = 5) => {
    try {
      // 确保音频已预加载
      preloadAudio()

      if (!audio) {
        console.error('音频对象创建失败')
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

          // 5秒后停止音频
          audioTimer = setTimeout(() => {
            stopAlarm()
          }, duration * 1000)
        })
        .catch((error) => {
          console.error('音频播放失败:', error)
          // 尝试使用备用方案
          fallbackAlarm(duration)
        })
    } catch (error) {
      console.error('创建音频失败:', error)
      // 尝试使用备用方案
      fallbackAlarm(duration)
    }
  }

  // 备用闹钟方案（使用浏览器内置音频）
  const fallbackAlarm = (duration: number = 5) => {
    try {
      console.log('使用备用闹钟方案')

      // 创建新的音频对象，使用简单的提示音
      const fallbackAudio = new Audio()

      // 尝试使用浏览器内置的提示音
      fallbackAudio.src =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'

      fallbackAudio.loop = true
      fallbackAudio.volume = 0.3

      fallbackAudio
        .play()
        .then(() => {
          console.log('备用音频开始播放')

          setTimeout(() => {
            fallbackAudio.pause()
            fallbackAudio.currentTime = 0
          }, duration * 1000)
        })
        .catch((error) => {
          console.error('备用音频也失败了:', error)
          // 最后尝试使用系统提示音
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('专注时间结束！', {
              body: '该休息了',
              icon: '/favicon.ico',
            })
          }
        })
    } catch (error) {
      console.error('备用方案失败:', error)
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
