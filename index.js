const { app, BrowserWindow, Menu, ipcMain } = require('electron')
let { localDownload } = require('./local.json')

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path')
const ytdl = require('ytdl-core');
const { promisify } = require('util')

const getInfoVideo = promisify(ytdl.getInfo)

const expre = express()

let info;

expre.use(bodyParser.urlencoded({ extended: true }))
expre.use(bodyParser.json())
expre.use(express.static(path.join(localDownload)))

expre.get('/', (req, res) => res.sendFile(path.join(localDownload+`/${info.title}`, 'index.html')))

expre.post('/download', async (req, res) => {
    try {
        info = await getInfoVideo(req.body.url.replace('https://www.youtube.com/watch?v=', ''))
        ytdl(req.body.url)
            .pipe(fs.createWriteStream(`${localDownload}/${info.title}.mp4`))
            .on('finish', () => res.status(200).json({ video: `${info.title}.mp4` }))
    } catch (err) {
        res.status(500).json(err)
    }
})

const port = process.env.PORT || 8080

expre.listen(port)

let mainWindow = null;
let setWindow = null;
app.on('ready', () => {
    console.log('Application is running')
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        icon: './icons/icon'
    })

    let menu = Menu.buildFromTemplate([{
        label: 'Novo',
        submenu: [{
            label: 'Baixar Videos',
            click: () => {
                mainWindow.loadURL(`file://${__dirname}/index.html`)
            }
        },
        {
            label: 'Local de download',
            click: () => {
                if (setWindow == null) {
                    setWindow = new BrowserWindow({
                        width: 500,
                        height: 250,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        resizable: false,
                        alwaysOnTop: true
                    })

                    setWindow.loadURL(`file://${__dirname}/set.html`)

                    setWindow.on('closed', () => {
                        setWindow = null;
                    })
                }
            }
        },]
    }])
    Menu.setApplicationMenu(menu)

    mainWindow.loadURL(`file://${__dirname}/index.html`)

})

app.on('window-all-closed', () => {
    app.quit()
})

ipcMain.on('open-set-window', () => {
    if (setWindow == null) {
        setWindow = new BrowserWindow({
            width: 500,
            height: 250,
            webPreferences: {
                nodeIntegration: true
            },
            resizable: false,
            alwaysOnTop: true
        })

        setWindow.loadURL(`file://${__dirname}/set.html`)

        setWindow.on('closed', () => {
            setWindow = null;
        })
    }
})

ipcMain.on('close-set-window', () => {
    setWindow.close()

})