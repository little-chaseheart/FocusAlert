import '@/assets/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import useAudioStore from './stores/audioControl'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 预加载音频
const audioStore = useAudioStore()
audioStore.preloadAudio()

app.mount('#app')
