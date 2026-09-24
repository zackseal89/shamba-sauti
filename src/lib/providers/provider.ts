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
    "Majani ya mahindi kuwa manjano yanaweza kusababishwa na upungufu wa naitrojeni, maji mengi au machache, au uharibifu wa mizizi. Muundo wa umanjano utasaidia kutambua chanzo.",
  likelyCauses: [
    "Upungufu wa naitrojeni, hasa majani ya chini yakianza kuwa manjano",
    "Maji mengi au machache kuzunguka mizizi",
    "Uharibifu wa mizizi kutokana na wadudu au udongo mgumu",
  ],
  checks: [
    "Angalia kama umanjano unaanzia kwenye majani ya chini au mapya",
    "Gusa udongo sentimita 5–8 chini na uangalie kama maji yamesimama",
    "Kagua mizizi ya mimea michache kuona uharibifu au wadudu",
  ],
  actions: [
    "Rekebisha mifereji au ratiba ya kumwagilia kabla ya kuongeza pembejeo",
    "Ondoa mimea iliyoharibika sana na linganisha dalili shambani",
    "Tumia kipimo cha udongo au ushauri wa eneo lako kabla ya kuweka mbolea",
  ],
  caution:
    "Huu ni mwongozo, si utambuzi wa uhakika. Usichanganye au kuongeza kemikali bila kusoma lebo na kupata ushauri wa eneo lako.",
  escalation:
    "Wasiliana na afisa ugani ikiwa umanjano unasambaa haraka, mimea inanyauka, au mizizi imeharibika sana.",
};

export function buildMockAnswer(input: AskRequest): AgriculturalAnswer {
  return input.language === "sw" ? swahiliAnswer : englishAnswer;
}
