import { useEffect, useState } from "react";

// Left "Contents" column. It lists whatever numbered sections are on the page
// (anything carrying data-toc), so hidden sections drop out on their own.
interface Entry { id: string; label: string; num: string }

export function PaperToc() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState("abstract");

  useEffect(() => {
    const refresh = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".paper [data-toc]"));
      const next = els.map((el) => ({
        id: el.id,
        label: el.dataset.toc ?? el.id,
        num: el.dataset.num || el.querySelector(".ph2 .n")?.textContent || "",
      }));
      setEntries((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));

      let current = els[0]?.id ?? "abstract";
      for (const el of els) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.3) current = el.id;
      }
      setActive(current);
    };

    let ticking = false;
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        refresh();
        ticking = false;
      });
    };

    refresh();
    // Sections appear as their data loads, so watch the column for changes
    const observer = new MutationObserver(schedule);
    const paper = document.querySelector(".paper");
    if (paper) observer.observe(paper, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <aside className="toc" aria-label="Contents">
      <div className="lbl">Contents</div>
      <ol>
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={active === e.id ? "on" : undefined}
              aria-current={active === e.id ? "true" : undefined}
              onClick={(ev) => {
                ev.preventDefault();
                document.getElementById(e.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>{e.num}</span>
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
