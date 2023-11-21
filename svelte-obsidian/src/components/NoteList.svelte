<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedNote, setNote, saveCurrentNote } from '../stores/selectedNoteStore'; // Import the store
  import { getAll, editNote, deleteNote } from "../api/noteService";
  import { Icon, Trash, Pencil, Check, Plus, ArrowSmallDown} from "svelte-hero-icons";

  let notes: any[] = [];
  let tempName: string = '';

  const openNote = (note: any) => {
    setNote({ ...note, editing: false }); // Reset editing state
  };

  const createNewNoteHandler = () => {
    setNote();
  };

  const saveCurrentNoteHandler = async () => {
    const { name, content } = $selectedNote;
    saveCurrentNote(name, content);
    notes = await getAll();
  };

  const editNoteHandler = (note: any) => {
    const index = notes.findIndex((n) => n.name === note.name);
    
    if (index !== -1) {
      tempName = notes[index].name;
      notes[index].editing = true;
      selectedNote.set(notes[index]); 
    }
  };

  const saveEditedNameHandler = async (event: Event, note: any) => {
    event.stopPropagation();
    try {
      // Save the edited note name
      await editNote(tempName, note.name);
      notes = await getAll();
    } catch (error) {
      console.error(`Error saving edited note name "${$selectedNote.name}":`, error);
    }
  };

  const deleteNoteHandler = async (note: any) => {
    try {
      await deleteNote(note.name);
      console.log(`Deleting note: ${note.name}`);
      // Fetch the updated notes after deletion
      notes = await getAll();
    } catch (error) {
      console.error(`Error deleting note "${note.name}":`, error);
    }
  };

  onMount(async () => {
    notes = await getAll();
  });
</script>

<div class="notes-list bg-gray-800 text-white p-6 rounded-lg">
  <div class="flex items-center mb-4">
    <h2 class="text-2xl font-semibold">My Notes</h2>
    <button
      title="Add new note"
      class="ml-auto border border-gray-700 text-white px-4 py-2 rounded"
      on:click={createNewNoteHandler}
    >
      <Icon src="{Plus}" size="16" />
    </button>
    <button
      title="Save current note"
      class="ml-2 border border-gray-700 text-white px-4 py-2 rounded"
      on:click={saveCurrentNoteHandler}
    >
      <Icon src="{ArrowSmallDown}" size="16" />
    </button>
  </div>
  <ul>
    {#each notes as note (note)}
      <li class="mb-2 p-2 border border-gray-700 rounded cursor-pointer flex justify-between items-center">
        {#if note.editing}
          <button class="flex items-center cursor-pointer">
            <input
              type="text"
              bind:value={note.name}
              class="mr-2 bg-transparent border-b border-gray-400 text-white focus:outline-none focus:border-blue-300"
            />
          </button>
        {:else}
          <div  on:click={() => openNote(note)} class="flex items-center cursor-pointer">
            <span class="mr-2">{note.name}</span>
          </div>
        {/if}
        <div class="flex items-center">
          {#if note.editing}
            <button
              title="Save Name"
              class="text-green-500 hover:text-green-400 focus:outline-none focus:ring focus:border-blue-300 px-1"
              on:click={(event) => saveEditedNameHandler(event, note)}
            >
              <Icon src="{Check}" size="16" />
            </button>
          {:else}
            <button
              title="Edit Name"
              class="text-white focus:outline-none focus:ring focus:border-blue-300 px-1"
              on:click={() => editNoteHandler(note)}
            >
              <Icon src="{Pencil}" size="16" />
            </button>
          {/if}
          <button
            title="Delete Note"
            class="text-white focus:outline-none focus:ring focus:border-blue-300 px-1"
            on:click={() => deleteNoteHandler(note)}
          >
            <Icon src="{Trash}" size="16" />
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
