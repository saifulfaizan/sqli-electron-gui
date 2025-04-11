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
