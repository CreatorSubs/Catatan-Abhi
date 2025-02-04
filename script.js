const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log('Filter clicked:', button.textContent);
        // Add your filtering logic here based on the button clicked
    });
});

// Add new note functionality
const addIcon = document.getElementById('addIcon');
const notesContainer = document.getElementById('notesContainer');

addIcon.addEventListener('click', () => {
    const newNote = document.createElement('div');
    newNote.classList.add('note');
    newNote.dataset.id = generateUniqueId();
    newNote.innerHTML = `
        <h2>Catatan Baru</h2>
        <p>Isi catatan baru...</p>
    `;

    newNote.addEventListener('click', () => {
        openEditModal(newNote); // Call the openEditModal function
    });

    notesContainer.appendChild(newNote);
    saveNotesToLocalStorage();
});

// Search functionality
const searchIcon = document.getElementById('searchIcon');
const searchBox = document.getElementById('searchBox');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
    searchBox.style.display = searchBox.style.display === 'block' ? 'none' : 'block';
    if (searchBox.style.display === 'block') {
        searchInput.focus();
    }
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = notesContainer.querySelectorAll('.note');

    notes.forEach(note => {
        const noteTitle = note.querySelector('h2').textContent.toLowerCase();
        if (noteTitle.includes(searchTerm)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
});

// Edit note functionality (Modal)
const notes = document.querySelectorAll('.note'); // Select initial notes
const modal = document.getElementById('editModal');
const modalTitle = document.getElementById('editTitle');
const modalContent = document.getElementById('editContent');
const saveButton = document.getElementById('saveButton');
const closeButton = document.querySelector('.close-button');

function openEditModal(note) {  // Function to open the modal
    const noteId = note.dataset.id;
    const noteTitle = note.querySelector('h2').textContent;
    const noteContent = note.querySelector('p').textContent;

    modalTitle.value = noteTitle;
    modalContent.value = noteContent;
    modal.style.display = 'block';
    modal.currentNoteId = noteId;
}

notes.forEach(note => { // Event listeners for initial notes
    note.addEventListener('click', () => {
        openEditModal(note);
    });
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

saveButton.addEventListener('click', () => {
    const newTitle = modalTitle.value;
    const newContent = modalContent.value;

    const noteToUpdate = document.querySelector(`.note[data-id="${modal.currentNoteId}"]`);

    if (noteToUpdate) {
        noteToUpdate.querySelector('h2').textContent = newTitle;
        noteToUpdate.querySelector('p').textContent = newContent;
        modal.style.display = 'none';
        saveNotesToLocalStorage(); // Save changes to local storage
    } else {
        console.error('Catatan tidak ditemukan.');
    }
});


// Local storage functions
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15);
}

function saveNotesToLocalStorage() {
    const notes = notesContainer.querySelectorAll('.note');
    const notesData = Array.from(notes).map(note => ({
        id: note.dataset.id,
        title: note.querySelector('h2').textContent,
        content: note.querySelector('p').textContent
    }));
    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotesFromLocalStorage() {
    const notesData = JSON.parse(localStorage.getItem('notes')) || [];
    notesData.forEach(noteData => {
        const newNote = document.createElement('div');
        newNote.classList.add('note');
        newNote.dataset.id = noteData.id;
        newNote.innerHTML = `
            <h2>${noteData.title}</h2>
            <p>${noteData.content}</p>
        `;

        newNote.addEventListener('click', () => {
            openEditModal(newNote);
        });

        notesContainer.appendChild(newNote);
    });
}

window.addEventListener('DOMContentLoaded', loadNotesFromLocalStorage);