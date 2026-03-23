#  Cursor Theme Generator

A lightweight tool that converts uploaded `.cur` / `.ani` files into a Windows cursor theme installer (`.exe`).

---

##  Features

*  Upload multiple cursor files
*  Automatic cursor role mapping (Arrow, IBeam, etc.)
*  Auto validation & fallback handling
*  Generates NSIS installer (`.exe`)
*  Applies cursor theme instantly after installation

---

##  How It Works

```text
Upload files
    ↓
Process & map cursor roles
    ↓
Validate & fix missing mappings
    ↓
Build theme directory
    ↓
Generate NSIS script
    ↓
Compile into .exe
    ↓
Download installer
```

---

##  Usage

### 1. Start Server

```bash
node server.js
```

Server will run at:

```text
http://localhost:3000
```

---

### 2. Send Request

POST `/generate`

#### Form Data:

| Field     | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| files     | file[] | Cursor files (`.cur`, `.ani`) |
| themeName | string | Optional theme name           |

---

### 3. Response

* Downloads: `YourTheme_Installer.exe`
* Header: `X-Mapping` (JSON cursor mapping)

---

##  Output Structure

```text
build/
  └── <themeName>/
        *.ani / *.cur

installer/
  ├── installer.nsi
  └── <themeName>_Installer.exe
```

---

##  Important Notes

### 1. NSIS Timing Issue

There is a known issue where NSIS may randomly miss files during compilation if the `.nsi` file is read before the filesystem fully flushes.

✔ **Solution implemented:**

```js
await new Promise(r => setTimeout(r, 100));
```

This ensures the script is fully written before compilation.

---

### 2. File Naming

Avoid:

* Spaces in filenames
* Special characters

Recommended:

```text
arrow.ani
text_beam.ani
link_select.ani
```

---

### 3. Admin Privileges

Installer requires admin rights because it writes to:

```text
C:\Windows\Cursors\
```

---

##  Supported Cursor Roles

* Arrow
* Help
* AppStarting
* Wait
* Crosshair
* IBeam
* NWPen
* No
* SizeNS
* SizeWE
* SizeNWSE
* SizeNESW
* SizeAll
* UpArrow
* Hand

---

##  Tech Stack

* Node.js
* Express
* Multer
* NSIS

---

##  Roadmap / Future Updates

This project is still evolving. Planned improvements include:

*  **Visual editor for cursor mapping**
  Drag & drop files and assign roles (Arrow, IBeam, etc.) directly in the browser

*  **Direct icon editing & preview**
  Adjust hotspots, preview animations, and tweak cursor behavior before export

*  **More export options**
  Support for `.zip` packages and alternative installation methods

*  **Better file handling**
  Automatic filename normalization and smarter mapping detection

*  **Full cursor scheme support**
  Register themes properly instead of overriding current settings

---

>  The goal is to make cursor theme creation fully visual and accessible — no manual setup or NSIS knowledge required.


---

##  License

MIT
