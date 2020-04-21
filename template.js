const { ipcMain } = require('electron')
let { mainWindow } = require('./index')

module.exports = {
    geraMP() {
        let templateMenu = [
            {
                label: 'View',
                submenu: [{
                    role: 'reload'
                },
                {
                    role: 'toggledevtools',
                    accelerator: 'CmdOrCtrl+D'
                }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        role: 'minimize',
                        accelerator: 'Alt+M'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Baixar mais Vídeos',
                        click: () => {
                            ipcMain.emit('return-from-download')
                        },
                        accelerator: 'CmdOrCtrl+Shift+B'
                    },
                ]
            }];

        return templateMenu;
    }
}