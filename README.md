# HolyNote

HolyNote is a note-taking application inspired by Obsidian, built with Svelte on the front end and Node.js on the server side. It allows users to create, edit, and organize their notes seamlessly.

## Features

- **Rich Text Editing**: Utilize the power of the Tiptap editor to create and edit notes with Markdown and HTML support.

- **File Management**: Organize your notes effortlessly with the ability to create, edit, and delete notes.

- **Automatic Saving**: Notes are saved periodically to ensure that your work is never lost.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:

    ```bash
    cd holy-server
    npm install
    ```

    ```bash
    cd svelte-obsidian
    npm install
    ```

### Usage

1. Start the server:

    ```bash
    cd holy-server
    npm start
    ```

2. Build and run the Svelte app:

    ```bash
    cd svelte-obsidian
    npm build
    npm start
    ```

3. Run the Svelte client side in dev mode:

    ```bash
    cd svelte-obsidian
    npm run dev
    ```

Now you can access the HolyNote app by navigating to [http://localhost:5173/](http://localhost:5173/) in your web browser.

## Contributing

Contributions are welcome! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
