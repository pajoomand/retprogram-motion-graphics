const format = {
  fps: 30,
  width: 1920,
  height: 1080,
  mediaBasePath:
    "courses/good-clinical-practice/understanding-informed-consent",
} as const;

export const informedConsentConfig = {
  ...format,
  id: "RETProgramInformedConsent",
  durationInFrames: 900,
} as const;

export const informedConsentProofConfig = {
  ...format,
  id: "RETProgramInformedConsentProof",
  durationInFrames: 540,
} as const;

export {
  informedConsentPropsSchema,
  informedConsentProofPropsSchema,
  getInformedConsentDuration,
  getInformedConsentProofDuration,
} from "./props";
