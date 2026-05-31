import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Manav. Built with <span>&hearts;</span> and Three.js.</p>
    </footer>
  );
}
