import { cciTheme } from "../../themes/cci";
import { AnimatedHeading } from "./AnimatedHeading";
import { textMotion } from "./motion";

export const CourseHeader = ({
  course,
  section,
}: {
  readonly course: string;
  readonly section: string;
}) => (
  <div
    style={{
      position: "absolute",
      inset: "62px 96px auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: cciTheme.ink,
      fontSize: 19,
      letterSpacing: 0.2,
    }}
  >
    <AnimatedHeading motionId="course-header" from={0}>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ width: 36, height: 3, background: cciTheme.teal }} />
        <span style={{ fontWeight: 650 }}>{course}</span>
        <span style={{ color: cciTheme.muted }}>/</span>
        <span style={{ color: cciTheme.muted }}>{section}</span>
      </div>
    </AnimatedHeading>
    <AnimatedHeading
      motionId="program-label"
      from={textMotion.stagger}
      style={{ fontSize: 16, letterSpacing: 2, color: cciTheme.muted }}
    >
      RETPROGRAM
    </AnimatedHeading>
  </div>
);
