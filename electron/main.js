const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'), // 预加载脚本
    // },
  })

  // 开发环境加载本地服务器
  // win.loadURL('http://localhost:8080')

  // 生产环境加载打包后的文件
  win.loadFile(path.join(__dirname, '../dist/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
