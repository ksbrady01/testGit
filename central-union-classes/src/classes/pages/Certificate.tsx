import { Link } from "@tanstack/react-router";
import { Icon } from "../components/Icon";
import { NotFound } from "../components/CourseBits";
import { BRAND, ORG } from "../constants";
import { useApp } from "../state/AppProvider";
import { fmtDate, progressOf } from "../utils";

function drawCertificate(
  name: string,
  course: string,
  date: string,
  certId: string,
  logo: HTMLImageElement | null,
): HTMLCanvasElement | null {
  const W = 2000;
  const H = 1414;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d");
  if (!x) return null;
  x.fillStyle = "#FFFDF6";
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "#C9A34A";
  x.lineWidth = 6;
  x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = "#E3CF97";
  x.lineWidth = 2;
  x.strokeRect(62, 62, W - 124, H - 124);
  x.textAlign = "center";
  x.fillStyle = "#7A6328";
  if (logo) {
    const lh = 200;
    const lw = (lh * logo.width) / logo.height;
    x.drawImage(logo, W / 2 - lw / 2, 110, lw, lh);
  } else {
    x.font = "700 30px 'Instrument Sans', sans-serif";
    x.fillText(ORG.toUpperCase(), W / 2, 250);
  }
  x.fillStyle = "#1B2340";
  x.font = "800 110px 'Bricolage Grotesque', sans-serif";
  x.fillText("Certificate of Completion", W / 2, 430);
  x.fillStyle = "#4A536B";
  x.font = "400 38px 'Instrument Sans', sans-serif";
  x.fillText("This certifies that", W / 2, 520);
  x.fillStyle = "#2447A6";
  x.font = "700 100px 'Bricolage Grotesque', sans-serif";
  x.fillText(name, W / 2, 660);
  x.strokeStyle = "#C9A34A";
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(W / 2 - 520, 700);
  x.lineTo(W / 2 + 520, 700);
  x.stroke();
  x.fillStyle = "#4A536B";
  x.font = "400 38px 'Instrument Sans', sans-serif";
  x.fillText("has successfully completed the online class", W / 2, 790);
  x.fillStyle = "#1B2340";
  x.font = "700 60px 'Instrument Sans', sans-serif";
  x.fillText(course, W / 2, 880);
  x.textAlign = "left";
  x.fillStyle = "#4A536B";
  x.font = "500 32px 'Instrument Sans', sans-serif";
  x.fillText(`Awarded ${date}`, 180, 1220);
  x.fillText(`Certificate ID ${certId}`, 180, 1270);
  x.beginPath();
  x.arc(W - 300, 1180, 120, 0, Math.PI * 2);
  const g = x.createRadialGradient(W - 340, 1140, 10, W - 300, 1180, 120);
  g.addColorStop(0, "#F3C55C");
  g.addColorStop(1, "#B9860F");
  x.fillStyle = g;
  x.fill();
  x.textAlign = "center";
  x.fillStyle = "#3A2600";
  x.font = "800 34px 'Bricolage Grotesque', sans-serif";
  x.fillText("CENTRAL", W - 300, 1170);
  x.fillText("UNION", W - 300, 1210);
  return cv;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });

export function CertificatePage({ courseId }: { courseId: string }) {
  const { courses, learner, svc, toast } = useApp();
  const course = courses?.find((c) => c.id === courseId);
  if (!course) return <NotFound />;
  const pr = progressOf(learner, course);
  if (!pr.completed) {
    return (
      <div className="page card empty">
        <div className="ico-wrap">
          <Icon n="award" s={28} />
        </div>
        <h3>Certificate locked</h3>
        <p className="muted">
          Finish all {pr.total} lessons of {course.title} to earn this certificate. You're at{" "}
          {pr.pct}%.
        </p>
        <Link className="btn btn-primary" to="/learn/$courseId" params={{ courseId: course.id }}>
          Continue class
        </Link>
      </div>
    );
  }
  const name = svc?.me.name || "Central Union Learner";
  const date = fmtDate(pr.e?.completedAt);
  const certId = pr.e?.certId ?? `CU-${course.id.toUpperCase()}`;
  const save = async () => {
    try {
      await document.fonts.ready;
      const cv = drawCertificate(name, course.title, date, certId, await loadImage(BRAND.logoDeep));
      const blob = cv ? await new Promise<Blob | null>((r) => cv.toBlob(r, "image/png")) : null;
      if (!blob || !svc) throw new Error("render");
      await svc.downloads.save({
        filename: `Certificate - ${course.title.replace(/[^\w\s-]/g, "")}.png`,
        data: blob,
      });
      toast("Certificate saved", "download");
    } catch {
      toast("Couldn't save the certificate. Please try again.", "x");
    }
  };

  return (
    <div className="page stack" style={{ gap: "18px" }}>
      <div className="row between">
        <Link to="/my-learning" className="btn btn-ghost btn-sm">
          <Icon n="left" s={15} />
          My learning
        </Link>
        <button type="button" className="btn btn-gold" onClick={() => void save()}>
          <Icon n="download" s={17} />
          Download PNG
        </button>
      </div>
      <div className="cert-wrap">
        <div className="cert">
          <img className="c-org" src={BRAND.logoDeep} alt="Central Union Church of Christ" />
          <div className="c-title">Certificate of Completion</div>
          <div style={{ color: "#4A536B" }}>This certifies that</div>
          <div className="c-name">{name}</div>
          <div style={{ color: "#4A536B" }}>has successfully completed the online class</div>
          <div className="c-course">{course.title}</div>
          <div className="c-foot">
            <span>Awarded {date}</span>
            <span>Certificate ID {certId}</span>
          </div>
          <div className="seal">
            <Icon n="award" s={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
