export function SiteFooter() {
  return (
    <footer className="relative z-[1] mx-auto grid w-full max-w-[1180px] gap-4 border-t border-border px-5 py-8 text-[10.5px] tracking-[0.2em] text-subtle-foreground uppercase sm:grid-cols-3 sm:items-center md:px-8 print:hidden">
      <div className="text-foreground before:text-primary before:content-['■_']">END OF FILE</div>
      <div className="sm:text-center">© 2026 · MUNDI MORGADO · OAKLAND, CA</div>
      <div className="flex gap-4 sm:justify-end">
        <a className="hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="https://github.com/mundizzle">
          GitHub
        </a>
        <a className="hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="https://linkedin.com/in/mundi">
          LinkedIn
        </a>
        <a className="hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/rss.xml">
          RSS
        </a>
      </div>
    </footer>
  );
}
