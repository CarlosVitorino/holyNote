// src/api/noteService.ts
const endPoint = 'http://localhost:4000/api/notes';

export const getAll = async () => {
    try {
        const response = await fetch(endPoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const getMostRecentNote = async () => {
    try {
        const response = await fetch(endPoint + '/recent', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching most recent note:', error);
        throw error;
    }
};

export const saveNote = async (noteName: string, content: string) => {
    try {
        await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ noteName, content }),
        });
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
};

export const editNote = async (oldNoteName: string, newNoteName: string) => {
  try {
      await fetch(`${endPoint}/${oldNoteName}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newNoteName }),
      });
  } catch (error) {
      console.error(`Error editing note "${oldNoteName}":`, error);
      throw error;
  }
};

export const deleteNote = async (noteName: string) => {
    try {
        await fetch(`${endPoint}/${noteName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};
