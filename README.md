# Batch EPUB Converter

A secure, client-side web application to "fix" Apple Books EPUB files by removing metadata that causes compatibility issues with other e-readers (Kindle, Kobo, etc.).

**Features:**
*   **Batch Processing**: Convert multiple .epub or .zip files at once.
*   **100% Client-Side**: No files are ever uploaded to a server. All processing happens in your browser.
*   **Directory Support**: Drag and drop uncompressed ebook folders directly.
*   **Modern UI**: Built with React, Vite, and TailwindCSS.

## How to Run Locally

You need [Node.js](https://nodejs.org/) installed on your machine.

1.  **Open your terminal** and navigate to this directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  Open the link shown in the terminal (usually `http://localhost:5173`) in your browser.

## How to Build for Production

To create a static version of the app (e.g., for deployment):

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  The output files will be in the `dist` folder. You can host this folder on any static site hosting service (GitHub Pages, Vercel, Netlify, Cloudflare Pages).
