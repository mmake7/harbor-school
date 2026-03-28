// ===== 1. 다크모드 토글 (localStorage 활용) =====
const darkToggle = document.getElementById('darkToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  darkToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  darkToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
});

// ===== 2. 카운터 (DOM 조작 + 이벤트) =====
const counterValue = document.getElementById('counterValue');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
let count = 0;

function updateCounter(newValue) {
  count = newValue;
  counterValue.textContent = count;
  counterValue.classList.add('bump');
  setTimeout(() => counterValue.classList.remove('bump'), 150);
}

increaseBtn.addEventListener('click', () => updateCounter(count + 1));
decreaseBtn.addEventListener('click', () => updateCounter(count - 1));

// ===== 3. 폼 유효성 검사 =====
const demoForm = document.getElementById('demoForm');
const rangeInput = document.getElementById('range');
const rangeValue = document.getElementById('rangeValue');

rangeInput.addEventListener('input', () => {
  rangeValue.textContent = rangeInput.value;
});

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  // 이름 검사
  const username = document.getElementById('username');
  const usernameError = document.getElementById('usernameError');
  if (username.value.trim().length < 2) {
    usernameError.textContent = '이름을 2자 이상 입력해주세요.';
    username.classList.add('invalid');
    username.classList.remove('valid');
    isValid = false;
  } else {
    usernameError.textContent = '';
    username.classList.remove('invalid');
    username.classList.add('valid');
  }

  // 이메일 검사
  const email = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.textContent = '올바른 이메일을 입력해주세요.';
    email.classList.add('invalid');
    email.classList.remove('valid');
    isValid = false;
  } else {
    emailError.textContent = '';
    email.classList.remove('invalid');
    email.classList.add('valid');
  }

  // 결과 표시
  if (isValid) {
    const formResult = document.getElementById('formResult');
    formResult.textContent = `${username.value}님, 제출이 완료되었습니다!`;
    formResult.classList.add('show');
    setTimeout(() => formResult.classList.remove('show'), 3000);
  }
});

// ===== 4. 갤러리 모달 =====
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalColorBox = document.getElementById('modalColorBox');
const modalText = document.getElementById('modalText');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const color = item.dataset.color;
    modalColorBox.style.background = color;
    modalText.textContent = `${item.textContent} (${color})`;
    modal.classList.add('active');
  });
});

modalClose.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ===== 5. 아코디언 =====
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    // 다른 아이템 닫기
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ===== 6. 프로그레스 바 (Intersection Observer) =====
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const progressContainer = document.querySelector('.progress-container');
if (progressContainer) {
  progressObserver.observe(progressContainer);
}

// ===== 7. 할 일 목록 (CRUD + localStorage) =====
const todoInput = document.getElementById('todoInput');
const todoAddBtn = document.getElementById('todoAddBtn');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');
    li.innerHTML = `
      <button class="todo-check">${todo.done ? '✅' : '⬜'}</button>
      <span class="todo-text">${todo.text}</span>
      <button class="todo-delete">🗑️</button>
    `;
    li.querySelector('.todo-check').addEventListener('click', () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });
    li.querySelector('.todo-delete').addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

renderTodos();

// ===== 8. 맨 위로 버튼 (스크롤 이벤트) =====
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== 9. 네비게이션 활성 링크 (스크롤 감지) =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--primary)' : '';
  });
});
