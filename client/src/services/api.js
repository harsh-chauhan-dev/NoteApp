const API_URL = import.meta.env.VITE_API_URL;

// Auth APIs
export const authAPI = {
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/auth/v1/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  },

  refreshToken: async () => {
    const response = await fetch(`${API_URL}/api/auth/v1/refreshToken`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  }
};

// Notes APIs
export const notesAPI = {
  createNote: async (title, content, is_pinned = false) => {
    const response = await fetch(`${API_URL}/api/v1/create/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, is_pinned }),
      credentials: 'include'
    });
    return response.json();
  },

  getAllNotes: async () => {
    const response = await fetch(`${API_URL}/api/v1/get/notes`, {
      method: 'GET',
      credentials: 'include'
    });
    return response.json();
  },

  getNote: async (id) => {
    const response = await fetch(`${API_URL}/api/v1/get/note/${id}`, {
      method: 'GET',
      credentials: 'include'
    });
    return response.json();
  },

  updateNote: async (id, title, content, is_pinned) => {
    const response = await fetch(`${API_URL}/api/v1/update/note/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, is_pinned }),
      credentials: 'include'
    });
    return response.json();
  },

  deleteNote: async (id) => {
    const response = await fetch(`${API_URL}/api/v1/delete/note/${id}`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  }
};
