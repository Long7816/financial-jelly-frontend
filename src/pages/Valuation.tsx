import type { Company } from "../types";
import { valuationConfig } from "../data/companyResearch";
import { MetricWorkspace } from "./MetricWorkspace";

const peers = [
  { name: "聯電（2303）", pe: "11.1", pb: "1.49", margin: "32.4%", growth: "+4.5%" },
  { name: "同業 A", pe: "18.6", pb: "3.12", margin: "41.8%", growth: "+7.2%" },
  { name: "同業 B", pe: "15.3", pb: "2.04", margin: "28.7%", growth: "−1.6%" },
  { name: "示意中位數", pe: "15.3", pb: "2.04", margin: "32.4%", growth: "+4.5%" },
];

function PeerComparison() {
  return (
    <section className="panel peer-comparison" aria-labelledby="peer-comparison-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">PEER SNAPSHOT</span>
          <h2 id="peer-comparison-title">同業比較基準</h2>
        </div>
        <span className="tag">Demo Mock</span>
      </div>
      <p className="peer-comparison-note">
        僅示範比較欄位；正式資料必須統一產業、價格日、財報期間與計算口徑。
      </p>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">估值與獲利能力同業示意比較</caption>
          <thead>
            <tr>
              <th scope="col">公司／基準</th>
              <th scope="col">P/E</th>
              <th scope="col">P/B</th>
              <th scope="col">毛利率</th>
              <th scope="col">營收年增</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((peer, index) => (
              <tr className={index === 0 ? "current-company" : ""} key={peer.name}>
                <th scope="row">{peer.name}</th>
                <td className="mono">{peer.pe} 倍</td>
                <td className="mono">{peer.pb} 倍</td>
                <td className="mono">{peer.margin}</td>
                <td className="mono">{peer.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Valuation({ company }: { company: Company }) {
  return (
    <MetricWorkspace
      company={company}
      config={valuationConfig}
      supplemental={<PeerComparison />}
    />
  );
}
