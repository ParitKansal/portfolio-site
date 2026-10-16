export function Footer() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} Parit Kansal · Machine Learning Scientist</span>
      <span className="fl">
        <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-github">GitHub</a>
        <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-linkedin">LinkedIn</a>
        <a href="mailto:paritkansal121@gmail.com" data-testid="link-footer-email">Email</a>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-testid="button-back-to-top">
          Back to top ↑
        </button>
      </span>
    </footer>
  );
}
