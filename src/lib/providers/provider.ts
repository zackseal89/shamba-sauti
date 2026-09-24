import type { AgriculturalAnswer, AskRequest, ProviderMode } from "@/lib/contracts";

type ProviderConfig = {
  provider?: string;
  apiKey?: string;
};

export function selectProviderMode(config: ProviderConfig): ProviderMode {
  return config.provider === "mansa" && Boolean(config.apiKey) ? "mansa" : "mock";
}

const englishAnswer: AgriculturalAnswer = {
  summary:
    "Yellow maize leaves can come from low nitrogen, water stress, or root damage. The leaf pattern and where yellowing started will help narrow it down.",
  likelyCauses: [
    "Nitrogen shortage, especially when older lower leaves yellow first",
    "Too much or too little water around the roots",
    "Root damage from pests or compacted soil",
  ],
  checks: [
    "Check whether yellowing starts on older lower leaves or new leaves",
    "Feel the soil 5–8 cm deep and check for standing water",
    "Inspect a few plants for damaged roots, tunnels, or visible insects",
  ],
  actions: [
    "Improve drainage or watering consistency before adding inputs",
    "Remove badly damaged plants and compare symptoms across the field",
    "Use a soil test or local extension recommendation before applying fertiliser",
  ],
  caution:
    "This is guidance, not a confirmed diagnosis. Do not mix or increase chemicals without reading the label and getting local advice.",
  escalation:
    "Contact an agricultural extension officer if yellowing spreads quickly, plants wilt, or roots show serious damage.",
};

const swahiliAnswer: AgriculturalAnswer = {
  summary:
    "Majani ya mahindi kuwa ya njano mara nyingi husababishwa na ukosefu wa mbolea ya nitrogen, maji kuwa mengi au shamba kukauka, au mizizi kuharibiwa na wadudu.",
  likelyCauses: [
    "Ukosefu wa mbolea ya nitrogen, hasa majani ya chini yakianza kuwa ya njano kwanza",
    "Maji mengi yaliyosimama au shamba kukosa maji ya kutosha",
    "Mizizi kuharibiwa na wadudu wa ardhini au udongo ulioshikana sana",
  ],
  checks: [
    "Chunguza kama majani ya chini ndiyo yameanza kubadilika rangi au ni yale mapya ya juu",
    "Gusa udongo kuona kama una unyevu unaofaa au kama maji yametuama shambani",
    "Ng'oa mmea mmoja ulioathirika ukague mizizi kuona dalili za wadudu au kuoza",
  ],
  actions: [
    "Tengeneza mifereji ya kupitisha maji au rekebisha kumwagilia kabla ya kuweka dawa",
    "Ondoa mimea iliyoathirika vibaya ili kuzuia kuenea kwa ugonjwa",
    "Weka mbolea inayofaa (kama vile CAN au Urea) kulingana na ushauri wa afisa wa kilimo",
  ],
  caution:
    "Huu ni mwongozo wa kukusaidia shambani, si utambuzi wa uhakika. Usichanganye au kutumia kemikali kiholela bila kusoma maelekezo ya lebo na kupata ushauri wa eneo lako.",
  escalation:
    "Wasiliana na afisa wa kilimo (extension officer) wa eneo lako mara moja iwapo shida inasambaa kwa kasi au mimea inanyauka.",
};

export function buildMockAnswer(input: AskRequest): AgriculturalAnswer {
  return input.language === "sw" ? swahiliAnswer : englishAnswer;
}
