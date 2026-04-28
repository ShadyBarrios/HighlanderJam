function navigateTo(url) {
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '0';
  setTimeout(() => window.location.href = url, 400);
}