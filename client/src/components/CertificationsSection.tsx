import { useQuery } from "@tanstack/react-query";
import type { Certification } from "@shared/schema";
import { useSectionNumber } from "./PaperSection";

// Shown as a subsection of Education ("7.1 Certifications"), but it keeps its
// own section key so it can still be hidden separately from the admin bar.
export function CertificationsSection() {
  const n = useSectionNumber();
  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"]
  });

  if (isLoading || !certifications?.length) return null;

  return (
    <section id="certifications" style={{ scrollMarginTop: 70 }}>
      <h3 className="ph3">
        {n != null && <span className="n">{n}.1</span>}
        Certifications
      </h3>
      <div className="certs">
        {certifications.map((cert, index) => {
          const body = (
            <>
              <b>{cert.name}</b>
              <span>{cert.issuer} · {cert.date}{cert.link ? " ↗" : ""}</span>
            </>
          );
          return cert.link ? (
            <a key={cert.id ?? index} className="cert" href={cert.link} target="_blank" rel="noopener noreferrer" data-testid={`card-certification-${index}`}>{body}</a>
          ) : (
            <div key={cert.id ?? index} className="cert" data-testid={`card-certification-${index}`}>{body}</div>
          );
        })}
      </div>
    </section>
  );
}
