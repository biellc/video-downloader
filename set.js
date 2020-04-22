const local = document.querySelector('input')
const save = document.querySelector('button')
const jsonfile = require('jsonfile')
const { ipcRenderer } = require('electron')

save.addEventListener('click', () => {
    if (local.value != 0) {
        jsonfile.writeFile('./local.json', { "localDownload": local.value })
            .then(() => {
                console.log(`Local salvo com sucesso!`)
            }).catch((err) => {
                console.log(err)
            })
        local.textContent = ""
        ipcRenderer.send('close-set-window')
    } else {
        console.log('Nenhum local inserido')
    }
});