# RIC App Launcher and Tools

This project includes two browser-based tools:
- **Bone Graft & Excision Description Generator**
- **Medical Note Builder**

Both run as static web pages—no server setup required beyond a simple file server.

## How to preview the site (kid-friendly steps)
1. **Open a terminal** (the black box where you type commands).
2. **Go to the project folder** (where the files live):
   - **If you don't have the files yet**: download them first. The two easy ways are:
     - **Git (if installed):** type `git clone <repo-url>` in any folder (like Documents). This creates a new `RIC` folder with the files.
     - **ZIP download:** click the **Code ▾** button on the repo page, choose **Download ZIP**, then unzip it. The unzipped folder will be named `RIC`.
   - **If you already downloaded or unzipped the project**: open a terminal in that same `RIC` folder (the one that contains `index.html`, `bone-graft.html`, etc.). If you're one level above it, run `cd RIC`.
   - **Unsure where the files are?** Search your computer for a folder named `RIC` or for `index.html`. Once you see it, right-click inside that folder and pick **Open in Terminal** (or similar) to start typing commands there.
3. **Start a tiny helper server** so the pages load correctly on your computer. Pick one:
   - If you have **Python 3**, type `python -m http.server 8000` and press Enter.
   - If you have **Node + npm**, type `npx serve .` and press Enter.
4. **Open your web browser** on the same computer and go to `http://localhost:8000`.
5. You will see the **launcher** with two big buttons. Click one to open a tool.
6. When done, press **Ctrl + C** in the terminal to stop the helper server.

## Quick tips
- **Login gate**: the Medical Note Builder shows a simple login prompt first.
- **Saving your work**: the Medical Note Builder keeps a draft in your browser storage until you clear it.
- **Printing**: use your browser's Print (Ctrl/Cmd + P). Each page is already print-friendly.

## What you need installed
- A modern web browser (Chrome, Edge, Firefox, or Safari).
- Either **Python 3** or **Node + npm** to run the helper server (only one is needed).

## Troubleshooting
- If the page won't load, make sure the server command is still running in the terminal.
- If you want a fresh start, clear your browser's local storage for this site.

## If you're using this cloud workspace
- From the terminal at the project root (`/workspace/RIC`), start the helper server: `python -m http.server 8000`.
- Keep the terminal open. In the workspace UI, use the port-forwarding/preview button to open port **8000** in your browser.
- You'll see the launcher page in a new tab. Stop the server with **Ctrl + C** in the terminal when you're done.

## If you prefer VS Code with the Live Server extension
1) Open VS Code and choose **File > Open Folder…**, then select the `RIC` folder.
2) In the Explorer sidebar, right-click `index.html` and pick **Open with Live Server**.
3) Your browser will open to a local address (usually `http://127.0.0.1:5500`). Click the launcher buttons to enter each tool.
4) To stop, return to VS Code and click **Stop Live Server** in the status bar.

