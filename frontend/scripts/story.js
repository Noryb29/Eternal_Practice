let currentStoryId = null;
  let chapters = [];
  let currentPage = 0;
  const wordsPerPage = 80;

  // --- Story Selector ---
  async function loadStoryList() {
    const res = await fetch('/api/stories');
    const stories = await res.json();
    const select = document.getElementById('storySelect');
    select.innerHTML = '<option value="">-- Select a story --</option>';
    stories.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.title} (${s.chapter_count} chapter${s.chapter_count !== 1 ? 's' : ''})`;
      select.appendChild(opt);
    });
  }

  async function onStorySelect() {
    const select = document.getElementById('storySelect');
    const id = select.value;
    if (!id) {
      currentStoryId = null;
      chapters = [];
      currentPage = 0;
      updateStoryView();
      return;
    }
    const res = await fetch(`/api/stories/${id}`);
    const story = await res.json();
    currentStoryId = story.id;
    document.getElementById('storyTitle').value = story.title;
    chapters = story.chapters.map(ch => `=== ${story.title} ===\n--- ${ch.title} ---\n\n${ch.content}`);
    currentPage = chapters.length > 0 ? 0 : 0;
    updateStoryView();
  }

  function newStory() {
    currentStoryId = null;
    chapters = [];
    currentPage = 0;
    document.getElementById('storyTitle').value = '';
    document.getElementById('chapterTitle').value = '';
    document.getElementById('storyInput').value = '';
    document.getElementById('storySelect').value = '';
    updateStoryView();
  }

  // --- Add Story / Chapter ---
  async function addStory() {
    const title = document.getElementById('storyTitle').value.trim();
    const chapterTitle = document.getElementById('chapterTitle').value.trim();
    const text = document.getElementById('storyInput').value.trim();

    if (!title || !chapterTitle) {
      alert('Please enter both Story Title and Chapter Title.');
      return;
    }

    if (!currentStoryId) {
      // Create a new story
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const story = await res.json();
      currentStoryId = story.id;
    }

    // Add chapter
    const res = await fetch(`/api/stories/${currentStoryId}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: chapterTitle, content: text }),
    });
    const chapter = await res.json();

    // Append to local pagination
    chapters.push(`=== ${title} ===\n--- ${chapter.title} ---\n\n${chapter.content}`);
    currentPage = chapters.length - 1;
    updateStoryView();

    document.getElementById('chapterTitle').value = '';
    document.getElementById('storyInput').value = '';
    loadStoryList();
  }

  // --- Pagination ---
  function updateStoryView() {
    const storyOutput = document.getElementById('storyTextContainer');
    const pageInfo = document.getElementById('pageInfo');
    if (chapters.length === 0) {
      storyOutput.value = '';
      pageInfo.innerText = 'Page 0';
      return;
    }
    storyOutput.value = chapters[currentPage];
    pageInfo.innerText = `Page ${currentPage + 1} of ${chapters.length}`;
  }

  function nextPage() {
    if (currentPage < chapters.length - 1) {
      currentPage++;
      updateStoryView();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updateStoryView();
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', loadStoryList);
