// server/index.js
const express = require('express');
const { writeFile, readFile, readdir, stat, unlink } = require('fs/promises');
const { join } = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

const allowedOrigins = ['http://localhost:4173', 'http://127.0.0.1:5173'];
var corsOptions = {
    origin: allowedOrigins,
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const notesFolder = 'notes';

app.get('/api/notes', async (req, res) => {
    try {
        const noteFiles = await readdir(notesFolder);

        const notes = await Promise.all(noteFiles.map(async (file) => {
            const noteName = file.replace(/\.html$/, ''); // Change the file extension
            const notePath = join(notesFolder, file);

            try {
                const content = await readFile(notePath, 'utf-8');
                return {
                    name: noteName,
                    content: content,
                };
            } catch (error) {
                console.error(`Error reading note "${noteName}":`, error);
                return null;
            }
        }));

        // Filter out null values in case of errors
        const filteredNotes = notes.filter(note => note !== null);

        res.json(filteredNotes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/notes/recent', async (req, res) => {
    try {
        const noteFiles = await readdir(notesFolder);
        let mostRecentNote = null;

        for (const current of noteFiles) {
            const currentPath = join(notesFolder, current);
            const stats = await stat(currentPath);
            const content = await readFile(currentPath, 'utf-8');

            if (!mostRecentNote || stats.mtime > mostRecentNote.mtime) {
                mostRecentNote = {
                    name: current.replace(/\.html$/, ''), // Change the file extension
                    content: content,
                };
            }
        }

        res.json(mostRecentNote);
    } catch (error) {
        console.error('Error fetching most recent note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/notes', async (req, res) => {
    const { noteName, content } = req.body;

    try {
        const notePath = join(notesFolder, `${noteName}.html`); // Change the file extension
        await writeFile(notePath, content, 'utf-8');
        console.log(`Note "${noteName}" saved successfully.`);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error saving note "${noteName}":`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/notes/:noteName', async (req, res) => {
    const { noteName: oldNoteName } = req.params;
    const { newNoteName } = req.body;

    try {
        const oldNotePath = join(notesFolder, `${oldNoteName}.html`);
        const existingContent = await readFile(oldNotePath, 'utf-8');

        // Delete the existing note file
        await unlink(oldNotePath);

        // Write the content to a new file with the updated name
        const newNotePath = join(notesFolder, `${newNoteName}.html`);
        await writeFile(newNotePath, existingContent, 'utf-8');

        console.log(`Note "${oldNoteName}" edited successfully to "${newNoteName}".`);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error editing note "${oldNoteName}":`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/notes/:noteName', async (req, res) => {
    const { noteName } = req.params;

    try {
        const notePath = join(notesFolder, `${noteName}.html`); // Change the file extension
        await unlink(notePath);
        console.log(`Note "${noteName}" deleted successfully.`);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error deleting note "${noteName}":`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
