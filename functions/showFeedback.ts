export const showFeedback = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.backgroundColor = 'rgba(1, 119, 253, 0.384)';
  }
  setTimeout(() => {
    if (element) {
      element.style.backgroundColor = 'white';
    }
  }, 800);
};
