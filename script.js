document.getElementById('getBtn').addEventListener('click', () => {
  const btn = document.getElementById('getBtn');
  btn.textContent = 'Loading...';
  setTimeout(() => btn.textContent = 'Get', 1500);
});
