// selectedNoteStore.ts
import { writable } from 'svelte/store';
import { saveNote } from '../api/noteService';

interface Note {
  name: string;
  content: string;
  editing: boolean;
}

export const selectedNote = writable<Note>({ name: '', content: '', editing: false });
export const toUpdate = writable(false);

export const setNote = (name: any = '', content: any = '') => {
  selectedNote.set({ name, content, editing: false });
  toUpdate.set(true);
};

export const saveCurrentNote = async (name: any, content: any) => {
  name = determineNoteName(name, content);
  try {
    await saveNote(name, content);
  } catch (error) {
    console.error('Error saving note:', error);
    // Handle the error as needed
  }
};

export const determineNoteName = (existingName: string, content: string) => {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const generateNoteName = () => {
    const timestamp = Date.now();
    return `Note_${timestamp}`;
  };

  if (existingName && existingName.length > 0) {
    return existingName;
  }

  const doc = new DOMParser().parseFromString(content, 'text/html');
  const firstElement = doc.body.firstElementChild;

  if (firstElement) {
    const strippedContent = stripHtml(firstElement.outerHTML);
    return strippedContent.trim();
  }

  // If there is no first element, generate a name
  return generateNoteName();
};
