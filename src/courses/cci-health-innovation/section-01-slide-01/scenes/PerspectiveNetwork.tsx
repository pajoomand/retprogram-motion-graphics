import { ConnectorLine } from "../../../../shared/components/cci/ConnectorLine";
import { PerspectiveCard } from "../../../../shared/components/cci/PerspectiveCard";
import { perspectives as p } from "../content";
import type { Slide01Timing } from "../timing";
import { DecisionNode } from "./DecisionNode";

export const PerspectiveNetwork = ({
  timing: t,
}: {
  readonly timing: Slide01Timing;
}) => (
  <>
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <ConnectorLine
        path="M606 512 C720 512 710 565 820 565"
        color={p.clinical.accent}
        from={t.clinical}
        convergeFrom={t.convergence}
      />
      <ConnectorLine
        path="M1314 512 C1200 512 1210 565 1100 565"
        color={p.innovation.accent}
        from={t.innovation}
        convergeFrom={t.convergence + 5}
      />
      <ConnectorLine
        path="M606 762 C720 762 710 655 820 655"
        color={p.funder.accent}
        from={t.funder}
        convergeFrom={t.convergence + 10}
      />
      <ConnectorLine
        path="M1314 762 C1200 762 1210 655 1100 655"
        color={p.livedExperience.accent}
        from={t.livedExperience}
        convergeFrom={t.convergence + 15}
        repeatFrom={t.resolution + 48}
        focusFrom={t.resolution}
      />
    </svg>
    <DecisionNode timing={t} />
    <PerspectiveCard perspective={p.clinical} from={t.clinical} />
    <PerspectiveCard perspective={p.innovation} from={t.innovation} />
    <PerspectiveCard perspective={p.funder} from={t.funder} />
    <PerspectiveCard
      perspective={p.livedExperience}
      from={t.livedExperience}
      focusFrom={t.livedExperience + 12}
    />
  </>
);
