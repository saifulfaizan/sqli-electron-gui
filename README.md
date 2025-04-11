# sqli-electron-gui
-versi GUI untuk SQLi Login Bypass guna Electron 

# Versi Desktop App (Electron)
 - Fungsi	Status
 - Input URL login	✅ Textbox
 - Auto detect form fields	✅
 - Senarai payload bypass	✅ Dropdown / textarea
 - Result response	✅ Output log
 - Snapshot result	✅ Boleh preview dalam tab
 - Simpan HTML	✅ Download butang
 - Multi-target list	⏳ Akan tambah
 - Proxy / header custom	⏳ Akan tambah
 - Bypass WAF	✅ (aktif)
 
 # Struktur Versi Electron GUI
 
- 📁 my-sqli-gui
  - ├── main.js (Electron main process)
  - ├── preload.js
  - ├── index.html
  - ├── renderer.js (frontend logic)
  - ├── assets/
  - └── logic/
    - └── bypass.js (payload handler)


      ## Struktur Projek
         - 📁 sqli-electron-gui/
            - ├── package.json
            - ├── main.js           // Electron Main Process
            - ├── preload.js        // Bridge ke renderer
            - ├── index.html        // GUI Utama
            - ├── renderer.js       // Logik frontend
            - ├── sqli.js           // SQLi form detector & executor
            - └── output/           // Folder untuk simpan snapshot

# ⚙️ LANGKAH 1 – Setup Projek Electron
- mkdir sqli-electron-gui
- cd sqli-electron-gui
  ### Init Projek + Install Electron
  - npm init -y
  - npm install axios cheerio qs electron
  - 
  ### Update package.json
``` json
{
  "name": "sqli-electron-gui",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "dependencies": {
    "electron": "^27.0.0"
  }
}
```
