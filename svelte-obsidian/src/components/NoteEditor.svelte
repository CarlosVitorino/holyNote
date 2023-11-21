<script>
  import "../styles/tiptap.scss";
  import { onMount, onDestroy } from "svelte";
  import { getMostRecentNote, saveNote } from "../api/noteService";
  import { browser } from '$app/environment'; 
  import { selectedNote, toUpdate, saveCurrentNote } from '../stores/selectedNoteStore';
  import { Markdown } from 'tiptap-markdown';
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";

  import  converter from 'html-to-markdown';

  let element;
  let editor;

  // Get the note name from the URL params
  $: noteName = $selectedNote.name;
  $: noteContent = $selectedNote.content;

  // Function to fetch the note content
  const fetchNoteContent = async () => {
    try {
      // If noteName is available, fetch the content of the selected note
      if (noteName) {
        return noteContent || 'error!';
      } else {
        // If noteName is not available, get the most recent note
        const mostRecentNote = await getMostRecentNote();
        const mostRecentNoteName = mostRecentNote?.name;
        
        if (mostRecentNoteName) {
          selectedNote.set(mostRecentNote);
          return mostRecentNote;
        } else {
          return '';
        }
      }
    } catch (error) {
      console.error('Error fetching note content:', error);
      return '';
    }
  };
  // Initialize the editor with the fetched note content
  onMount(async () => {
    const note = await fetchNoteContent();
    refreshEditor(note);
  });

  const refreshEditor = (note) => {
    if (editor) {
      editor.destroy();
    }

    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Markdown,
      ],
      content: note.content,
      onUpdate({ editor }) {
        const content = editor.getHTML();
        selectedNote.set({ name: noteName, content, editing: false });
      },
      autofocus: true,
      editable: true,
    });
  }

  onDestroy(() =>  {
    save();
  })

  $: if (browser && $selectedNote && $toUpdate) {
    toUpdate.set(false);
    refreshEditor($selectedNote);
  }

  // Save the note periodically
  const save = () => {
    if(!editor) return;
    const content = editor.getHTML();
    saveCurrentNote(noteName, content);
  };

  const savePeriodically = () => {
      setInterval(() => {
        if(noteName) {
          save();
        }
      }, 5000);
  };

  savePeriodically();

</script>

<div class="min-h-screen text-white" bind:this={element} />
