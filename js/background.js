function addNotesClustered(){
    const background = document.getElementById('animated-background');
    const musicNotes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    const colors = ['rgba(234, 179, 60, 0.3)', 'rgba(234, 179, 60, 0.2)', 'rgba(234, 179, 60, 0.25)'];

    // Create floating music notes
    for (let i = 0; i < 20; i++) {
      const note = document.createElement('div');
      note.className = 'floating-note';
      note.textContent = musicNotes[Math.floor(Math.random() * musicNotes.length)];
      note.style.left = `${Math.random() * 100}%`;
      note.style.color = colors[Math.floor(Math.random() * colors.length)];
      note.style.animationDuration = `${15 + Math.random() * 20}s`;
      // note.style.animationDelay = `${Math.random() * 10}s`;
      background.appendChild(note);
    }
}

function addNotesNotClustered() {
  const background = document.getElementById('animated-background');
  const musicNotes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
  const colors = ['rgba(234, 179, 60, 0.3)', 'rgba(234, 179, 60, 0.2)', 'rgba(234, 179, 60, 0.25)'];

  for (let i = 0; i < 20; i++) {
    const note = document.createElement('div');
    note.className = 'floating-note';
    note.textContent = musicNotes[Math.floor(Math.random() * musicNotes.length)];
    const duration = 15 + Math.random() * 20;
    note.style.left = `${Math.random() * 100}%`;
    note.style.color = colors[Math.floor(Math.random() * colors.length)];
    note.style.animationDuration = `${duration}s`;
    note.style.animationDelay = `-${Math.random() * duration}s`; // random point mid-cycle
    background.appendChild(note);
  }
}