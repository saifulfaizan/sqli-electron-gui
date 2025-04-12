# ⚡ elecTron Scanner-X


![logo](https://github.com/user-attachments/assets/8271c348-a687-48b0-ab94-f10f3958acfd)

> **elecTron Scanner-X** is an advanced, cyberpunk-inspired SQL Injection scanner & exploitation tool — designed to *detect*, *bypass*, and *extract* from vulnerable web apps and API endpoints.

---

## 🧠 What Can It Do?

`elecTron Scanner` is more than just a vulnerability scanner — it's a **smart auto-inject engine** for modern and legacy web targets.

### 🔍 1. Target Form, Login & API Endpoints
- Scan login forms, search bars, and JSON API
- Automatically inject crafted payloads to test vulnerabilities

### 🛠 2. Multiple Injection Engines:
| Engine Type     | Description |
|-----------------|-------------|
| `Union-based`   | Combine queries to extract data |
| `Error-based`   | Trigger SQL error leaks |
| `Time-based`    | Detect blind SQLi via delay |
| `Boolean-based` *(coming soon)* | Detect logic-based injection |
| `WAF Bypass`    | Payload obfuscation tricks |

---

## 💣 Features

- ✅ Auto detect form inputs (`email`, `username`, `search`, `id`, etc)
- ✅ Try both `GET` and `POST` methods
- ✅ Custom header support (e.g., `Bearer Token`, `User-Agent`)
- ✅ Intelligent dump engine (username:password, hash dumps)
- ✅ Auto save results to `.txt` & `.json`
- ✅ GUI mode via Electron
- ✅ Live logging with injection insights & timing

---

## 📦 Example Output

```bash
📥 Found input fields: email, password
🔁 Trying injection with GET...
💥 Injection successful (Time-based) on field: email
💾 Dump saved to: output/dump-1712912001234.txt
```

---

## 🖥️ Tech Stack

- ⚙️ Node.js + Electron (GUI)
- 🔎 Axios + Cheerio (web scanning)
- 🧪 Modular Engine System (`/scanner/engine-*`)
- 💾 File Output System

---

## ⚔️ Coming Soon

- 🔐 Hash Cracker (MD5 / SHA1 / bcrypt)
- 🌐 Dork Generator + Auto Scanner
- 🕸️ Crawler + Admin Page Finder
- 🧩 Boolean-based & Out-of-Band modules

---

## 💻 Usage

```bash
# Install dependencies
npm install

# Run GUI version
npm start

# OR CLI version (in dev)
node index.js
```

---

## 👽 Author

**elecTron-X Team**  
> “Scan smart, inject sharper.”  
[TikTok](https://www.tiktok.com/@saifulfaizan.my) | [email](saifulfaizan@gmail.com)

---

## 🧠 Disclaimer
This project is for **educational and authorized penetration testing** purposes only.  
Unauthorized usage against systems you do not own is **strictly prohibited**.
