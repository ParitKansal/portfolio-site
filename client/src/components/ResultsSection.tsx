import { PaperSection } from "./PaperSection";

// Headline numbers pulled from the experience and project write-ups.
// These are fixed text: update this list when a write-up's numbers change.
const rows = [
  { system: "Firstsource IDP", detail: "DONUT extraction", metric: "Field accuracy", value: 98.0, label: "98.0%" },
  { system: "Firstsource IDP", detail: "Gemma-3-4B judge", metric: "Document accuracy", value: 96.67, label: "96.67%" },
  { system: "ASK detection", detail: "Mask R-CNN", metric: "AP @ [.50:.95]", value: 97.1, label: "97.1%" },
  { system: "ASBL scoring", detail: "XGBoost + clustering", metric: "Visitor Recall @ 13%", value: 90.0, label: "90.0%" },
  { system: "AG News", detail: "LSTM, 50 W&B sweeps", metric: "Test accuracy", value: 92.5, label: "92.5%" },
  { system: "Quora pairs", detail: "Siamese LSTM", metric: "F1", value: 79.9, label: "79.9%" },
];

export function ResultsSection() {
  return (
    <PaperSection id="results" title="Results" lead="Headline numbers from the experience and project sections, in one place.">
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>System</th>
              <th>Metric</th>
              <th className="barcell">0 – 100%</th>
              <th style={{ textAlign: "right" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.system + r.metric}>
                <td>{r.system}<span className="sub">{r.detail}</span></td>
                <td>{r.metric}</td>
                <td><div className="meter"><i style={{ width: `${r.value}%` }} /></div></td>
                <td className="num"><b>{r.label}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tcap"><b>Table 1.</b> Production systems (top four) and academic projects (bottom two).</div>
      </div>
    </PaperSection>
  );
}
