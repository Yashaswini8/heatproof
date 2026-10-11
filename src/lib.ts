export type Mode = 'campus' | 'worksite'
export type Risk = 'Emergency' | 'High' | 'Medium' | 'Low'
export const STATUSES = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Verified'] as const
export type Status = (typeof STATUSES)[number]

export interface Report {
  id: string
  mode: Mode
  category: string
  location: string
  note: string
  noWater: boolean
  noShade: boolean
  noBreak: boolean
  symptoms: boolean
  risk: Risk
  reasons: string[]
  status: Status
  owner: string
  deadline: string
  resolution: string
  createdAt: number
  resolvedAt?: number
  photo?: string
  fixPhoto?: string
}

export const CATEGORIES: Record<Mode, { name: string; icon: string }[]> = {
  campus: [
    { name: 'No drinking water', icon: '🚱' },
    { name: 'Broken water cooler', icon: '🚰' },
    { name: 'Broken fan', icon: '🌀' },
    { name: 'Overheated classroom', icon: '🔥' },
    { name: 'No shade', icon: '⛱️' },
    { name: 'Waterlogging', icon: '🌊' },
    { name: 'Leak', icon: '💧' },
  ],
  worksite: [
    { name: 'No drinking water', icon: '🚱' },
    { name: 'No shade', icon: '⛱️' },
    { name: 'No rest break', icon: '⏱️' },
    { name: 'Heat symptoms', icon: '🤒' },
    { name: 'No first aid', icon: '🩹' },
    { name: 'Waterlogging', icon: '🌊' },
    { name: 'Leak', icon: '💧' },
  ],
}

export const LOCATIONS: Record<Mode, string[]> = {
  campus: [
    'Block A – Washroom', 'Block B – Room 302', 'Block B – Room 304', 'Block B – Floor 3 corridor',
    'Block C – Room 210', 'Block C – Lab 2', 'Library entrance', 'Canteen', 'Main Playground', 'Hostel – Ground floor',
  ],
  worksite: [
    'Site 1 – Tower crane area', 'Site 1 – Level 4', 'Site 1 – Gate',
    'Site 2 – Foundation pit', 'Site 3 – Access road', 'Site 3 – Brick yard',
  ],
}

export const OWNERS: Record<Mode, string[]> = {
  campus: ['Maintenance Team', 'Admin Office', 'Hostel Warden'],
  worksite: ['Site Supervisor', 'Contractor', 'NGO Responder'],
}

export const RANK: Record<Risk, number> = { Emergency: 0, High: 1, Medium: 2, Low: 3 }
const LEVELS: Risk[] = ['Emergency', 'High', 'Medium', 'Low']

interface RiskInput {
  category: string
  noWater: boolean
  noShade: boolean
  noBreak: boolean
  symptoms: boolean
}

// Transparent rule-based scoring. Not a medical diagnosis.
export function calculateRisk(r: RiskInput, temp: number, repeats = 0): { level: Risk; reasons: string[] } {
  const found: { level: Risk; reason: string }[] = []
  if (r.symptoms || r.category === 'Heat symptoms')
    found.push({ level: 'Emergency', reason: 'Heat symptoms reported: this person needs help now' })
  const waterIssue = r.noWater || r.category === 'No drinking water' || r.category === 'Broken water cooler'
  if (waterIssue && temp >= 35) found.push({ level: 'High', reason: `No drinking water while it is ${temp}°C` })
  if (r.noShade && r.noBreak) found.push({ level: 'High', reason: 'No shade and no rest break during heat' })
  if (r.category === 'Overheated classroom' && temp >= 38)
    found.push({ level: 'High', reason: `Classroom overheating at ${temp}°C` })
  if (r.category === 'Broken fan' || r.category === 'Overheated classroom')
    found.push({ level: 'Medium', reason: 'Poor ventilation or cooling' })
  if (r.category === 'Leak' && repeats > 0)
    found.push({ level: 'Medium', reason: `Repeated leak: ${repeats} earlier report(s) at this location` })
  if (r.category === 'Waterlogging') found.push({ level: 'Medium', reason: 'Waterlogging can block safe access' })
  if (found.length === 0) return { level: 'Low', reasons: ['Routine maintenance issue'] }
  const level = LEVELS.find((l) => found.some((f) => f.level === l)) as Risk
  return { level, reasons: found.map((f) => f.reason) }
}

const H = 3600000
const ROWS: [Mode, string, string, Status, number, string][] = [
  ['campus', 'Broken water cooler', 'Block B – Room 304', 'Verified', 70, ''],
  ['campus', 'Broken fan', 'Block B – Room 304', 'Resolved', 50, ''],
  ['campus', 'Overheated classroom', 'Block B – Room 304', 'In Progress', 20, ''],
  ['campus', 'No drinking water', 'Block B – Floor 3 corridor', 'Assigned', 9, 'w'],
  ['campus', 'Broken water cooler', 'Block B – Room 302', 'Reported', 2, 'w'],
  ['campus', 'Leak', 'Block A – Washroom', 'Verified', 90, ''],
  ['campus', 'Leak', 'Block A – Washroom', 'Resolved', 40, ''],
  ['campus', 'Leak', 'Block A – Washroom', 'Assigned', 6, ''],
  ['campus', 'No shade', 'Main Playground', 'Reported', 4, 's'],
  ['campus', 'Waterlogging', 'Library entrance', 'Resolved', 30, ''],
  ['campus', 'Broken fan', 'Block C – Lab 2', 'Verified', 60, ''],
  ['campus', 'Broken water cooler', 'Canteen', 'Verified', 100, ''],
  ['campus', 'Overheated classroom', 'Block C – Room 210', 'Reported', 1, ''],
  ['campus', 'No drinking water', 'Hostel – Ground floor', 'In Progress', 12, 'w'],
  ['worksite', 'No drinking water', 'Site 1 – Tower crane area', 'Reported', 3, 'w'],
  ['worksite', 'No shade', 'Site 1 – Level 4', 'Assigned', 8, 'sb'],
  ['worksite', 'No rest break', 'Site 2 – Foundation pit', 'In Progress', 5, 'b'],
  ['worksite', 'Heat symptoms', 'Site 2 – Foundation pit', 'Assigned', 2, 'x'],
  ['worksite', 'No first aid', 'Site 1 – Gate', 'Resolved', 26, ''],
  ['worksite', 'Waterlogging', 'Site 3 – Access road', 'Verified', 48, ''],
  ['worksite', 'No drinking water', 'Site 3 – Brick yard', 'Verified', 72, 'w'],
]

export function seedReports(): Report[] {
  const now = Date.now()
  return ROWS.map(([mode, category, location, status, hoursAgo, f], i) => {
    const flags = { noWater: f.includes('w'), noShade: f.includes('s'), noBreak: f.includes('b'), symptoms: f.includes('x') }
    const { level, reasons } = calculateRisk({ category, ...flags }, 37)
    const createdAt = now - hoursAgo * H
    const closed = status === 'Resolved' || status === 'Verified'
    return {
      id: `HP-${1001 + i}`, mode, category, location, note: '', ...flags,
      risk: level, reasons, status,
      owner: status === 'Reported' ? '' : OWNERS[mode][i % 3],
      deadline: new Date(createdAt + 48 * H).toISOString().slice(0, 10),
      resolution: closed ? 'Fixed on site and checked.' : '',
      createdAt,
      resolvedAt: closed ? createdAt + (2 + ((i * 5) % 28)) * H : undefined,
    }
  })
}

export const LANGS: [string, string][] = [
  ['en', 'English'], ['ta', 'தமிழ்'], ['hi', 'हिन्दी'], ['te', 'తెలుగు'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'],
]

const KEYS = ['Dashboard', 'Campus Mode', 'Worksite Mode', 'Choose what is wrong', 'Submit report', 'Why this risk level',
  'Not a medical diagnosis.', 'Reports received', 'Water issues resolved', 'Avg response (hrs)', 'High-risk closed',
  'Issue fixed', 'Still not fixed', 'Emergency', 'High', 'Medium', 'Low', 'Reported', 'Assigned', 'In Progress',
  'Resolved', 'Verified', 'No drinking water', 'Broken water cooler', 'Broken fan', 'Overheated classroom', 'No shade',
  'Waterlogging', 'Leak', 'No rest break', 'Heat symptoms', 'No first aid']

const WORDS: Record<string, string[]> = {
  ta: ['டாஷ்போர்டு', 'வளாகப் பயன்முறை', 'பணியிடப் பயன்முறை', 'என்ன பிரச்சனை என்று தேர்ந்தெடுக்கவும்', 'புகாரை அனுப்பு', 'இந்த ஆபத்து நிலை ஏன்',
    'இது மருத்துவ நோயறிதல் அல்ல.', 'பெறப்பட்ட புகார்கள்', 'தீர்க்கப்பட்ட நீர் சிக்கல்கள்', 'சராசரி பதில் (மணி)', 'முடிக்கப்பட்ட அதிக ஆபத்து',
    'சிக்கல் சரிசெய்யப்பட்டது', 'இன்னும் சரியாகவில்லை', 'அவசரம்', 'அதிகம்', 'நடுத்தரம்', 'குறைவு', 'புகாரளிக்கப்பட்டது', 'ஒதுக்கப்பட்டது', 'செயலில்',
    'தீர்க்கப்பட்டது', 'சரிபார்க்கப்பட்டது', 'குடிநீர் இல்லை', 'உடைந்த குடிநீர் குளிர்விப்பான்', 'உடைந்த மின்விசிறி', 'அதிக வெப்பமான வகுப்பறை', 'நிழல் இல்லை',
    'நீர் தேக்கம்', 'கசிவு', 'ஓய்வு இடைவேளை இல்லை', 'வெப்பப் பாதிப்பு அறிகுறிகள்', 'முதலுதவி இல்லை'],
  hi: ['डैशबोर्ड', 'कैंपस मोड', 'कार्यस्थल मोड', 'चुनें क्या समस्या है', 'रिपोर्ट भेजें', 'यह जोखिम स्तर क्यों',
    'यह चिकित्सीय निदान नहीं है।', 'प्राप्त रिपोर्टें', 'हल की गई पानी की समस्याएँ', 'औसत प्रतिक्रिया (घंटे)', 'बंद किए गए उच्च जोखिम मामले',
    'समस्या ठीक हो गई', 'अब भी ठीक नहीं हुई', 'आपातकाल', 'उच्च', 'मध्यम', 'कम', 'दर्ज', 'सौंपा गया', 'प्रगति में',
    'हल हुआ', 'सत्यापित', 'पीने का पानी नहीं', 'खराब वाटर कूलर', 'खराब पंखा', 'बहुत गर्म कक्षा', 'छाया नहीं',
    'जलभराव', 'रिसाव', 'आराम का समय नहीं', 'गर्मी के लक्षण', 'प्राथमिक चिकित्सा नहीं'],
  te: ['డాష్‌బోర్డ్', 'క్యాంపస్ మోడ్', 'పనిప్రదేశ మోడ్', 'ఏ సమస్యో ఎంచుకోండి', 'నివేదిక పంపండి', 'ఈ ప్రమాద స్థాయి ఎందుకు',
    'ఇది వైద్య నిర్ధారణ కాదు.', 'అందిన నివేదికలు', 'పరిష్కరించిన నీటి సమస్యలు', 'సగటు స్పందన (గంటలు)', 'ముగించిన అధిక ప్రమాద కేసులు',
    'సమస్య పరిష్కరించబడింది', 'ఇంకా పరిష్కారం కాలేదు', 'అత్యవసరం', 'అధికం', 'మధ్యస్థం', 'తక్కువ', 'నమోదైంది', 'కేటాయించబడింది', 'జరుగుతోంది',
    'పరిష్కరించబడింది', 'ధృవీకరించబడింది', 'తాగునీరు లేదు', 'పాడైన వాటర్ కూలర్', 'పాడైన ఫ్యాన్', 'చాలా వేడిగా ఉన్న తరగతి గది', 'నీడ లేదు',
    'నీరు నిలిచిపోవడం', 'లీకేజీ', 'విశ్రాంతి విరామం లేదు', 'వేడి లక్షణాలు', 'ప్రథమ చికిత్స లేదు'],
  kn: ['ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'ಕ್ಯಾಂಪಸ್ ಮೋಡ್', 'ಕಾರ್ಯಸ್ಥಳ ಮೋಡ್', 'ಯಾವ ಸಮಸ್ಯೆ ಎಂದು ಆರಿಸಿ', 'ವರದಿ ಕಳುಹಿಸಿ', 'ಈ ಅಪಾಯ ಮಟ್ಟ ಏಕೆ',
    'ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಲ್ಲ.', 'ಸ್ವೀಕರಿಸಿದ ವರದಿಗಳು', 'ಪರಿಹರಿಸಿದ ನೀರಿನ ಸಮಸ್ಯೆಗಳು', 'ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ (ಗಂಟೆ)', 'ಮುಗಿಸಿದ ಹೆಚ್ಚು ಅಪಾಯದ ಪ್ರಕರಣಗಳು',
    'ಸಮಸ್ಯೆ ಪರಿಹಾರವಾಗಿದೆ', 'ಇನ್ನೂ ಪರಿಹಾರವಾಗಿಲ್ಲ', 'ತುರ್ತು', 'ಹೆಚ್ಚು', 'ಮಧ್ಯಮ', 'ಕಡಿಮೆ', 'ವರದಿಯಾಗಿದೆ', 'ನಿಯೋಜಿಸಲಾಗಿದೆ', 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    'ಪರಿಹರಿಸಲಾಗಿದೆ', 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', 'ಕುಡಿಯುವ ನೀರಿಲ್ಲ', 'ಕೆಟ್ಟ ವಾಟರ್ ಕೂಲರ್', 'ಕೆಟ್ಟ ಫ್ಯಾನ್', 'ತುಂಬಾ ಬಿಸಿಯಾದ ತರಗತಿ', 'ನೆರಳಿಲ್ಲ',
    'ನೀರು ನಿಲ್ಲುವಿಕೆ', 'ಸೋರಿಕೆ', 'ವಿಶ್ರಾಂತಿ ವಿರಾಮವಿಲ್ಲ', 'ಬಿಸಿಲಿನ ಲಕ್ಷಣಗಳು', 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಇಲ್ಲ'],
  ml: ['ഡാഷ്ബോർഡ്', 'ക്യാമ്പസ് മോഡ്', 'തൊഴിലിടം മോഡ്', 'എന്താണ് പ്രശ്നം എന്ന് തിരഞ്ഞെടുക്കുക', 'റിപ്പോർട്ട് അയയ്ക്കുക', 'ഈ അപകട നില എന്തുകൊണ്ട്',
    'ഇത് വൈദ്യ നിർണ്ണയമല്ല.', 'ലഭിച്ച റിപ്പോർട്ടുകൾ', 'പരിഹരിച്ച ജല പ്രശ്നങ്ങൾ', 'ശരാശരി പ്രതികരണം (മണിക്കൂർ)', 'അടച്ച ഉയർന്ന അപകട കേസുകൾ',
    'പ്രശ്നം പരിഹരിച്ചു', 'ഇപ്പോഴും പരിഹരിച്ചിട്ടില്ല', 'അടിയന്തരം', 'ഉയർന്നത്', 'ഇടത്തരം', 'കുറവ്', 'റിപ്പോർട്ട് ചെയ്തു', 'ഏൽപ്പിച്ചു', 'പുരോഗമിക്കുന്നു',
    'പരിഹരിച്ചു', 'സ്ഥിരീകരിച്ചു', 'കുടിവെള്ളമില്ല', 'കേടായ വാട്ടർ കൂളർ', 'കേടായ ഫാൻ', 'അതിയായി ചൂടുള്ള ക്ലാസ്മുറി', 'തണലില്ല',
    'വെള്ളക്കെട്ട്', 'ചോർച്ച', 'വിശ്രമ ഇടവേളയില്ല', 'ചൂടിന്റെ ലക്ഷണങ്ങൾ', 'പ്രഥമശുശ്രൂഷ ഇല്ല'],
}

export const DICT: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(WORDS).map(([code, list]) => [code, Object.fromEntries(KEYS.map((k, i) => [k, list[i]]))]),
)
