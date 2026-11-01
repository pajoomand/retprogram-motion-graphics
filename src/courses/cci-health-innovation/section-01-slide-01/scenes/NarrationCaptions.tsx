import { BasicCaptions } from "../../../../shared/captions/BasicCaptions";
import captionAsset from "../../../../../public/courses/cci-health-innovation/section-01-slide-01/closed-captions.json";

export const NarrationCaptions = () => (
  <BasicCaptions
    name="Temporary narration captions - machine transcription, review required"
    width={1560}
    combineTokensWithinMilliseconds={0}
    style={{ position: "absolute", left: 180, bottom: 64 }}
    captions={captionAsset.captions.map((caption) => ({
      ...caption,
      text: ` ${caption.text}`,
    }))}
  />
);
