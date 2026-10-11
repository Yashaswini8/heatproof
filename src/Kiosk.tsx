// @ts-nocheck
import { useContext, useState } from "react";
import { LangContext } from "./i18n.tsx";
import PhoneDemo from "./PhoneDemo.tsx";

const TEXT = {
  en: {
    title: "Heat Check-In",
    back: "← Back",
    enterId: "Enter your Worker ID",
    next: "Next",
    clear: "Clear",
    how: "How do you feel?",
    ok: "I'm OK",
    hot: "Feeling hot / dizzy",
    emergency: "EMERGENCY",
    done: "Report sent",
    failed: "Could not send. Tell your supervisor.",
    tipOk: "Good. Drink water and take your shade breaks.",
    tipHot: "Stop work. Go to shade. Drink water. Your supervisor is told.",
    tipEmergency: "Help is being called. Stay where you are. Do not walk alone.",
    again: "New check-in",
    sms: "SMS mode",
    kiosk: "Kiosk mode",
    phone: "Call / SMS",
    smsHelp: "Text: ID then 1=OK 2=HOT 3=EMERGENCY. Example: 482 2",
    smsWrong: "Wrong format. Example: 482 2",
    smsOk: "Thanks. Stay hydrated and take shade breaks.",
    smsHot: "Stop work. Go to shade and drink water. Supervisor alerted.",
    smsEmergency: "EMERGENCY received. Help is on the way. Stay where you are.",
    send: "Send",
    next_lang: "हिन्दी",
  },
  hi: {
    title: "गर्मी जाँच",
    back: "← वापस",
    enterId: "अपना वर्कर आईडी दर्ज करें",
    next: "आगे",
    clear: "मिटाएँ",
    how: "आप कैसा महसूस कर रहे हैं?",
    ok: "मैं ठीक हूँ",
    hot: "गर्मी / चक्कर",
    emergency: "आपातकाल",
    done: "रिपोर्ट भेज दी गई",
    failed: "भेज नहीं सके। अपने सुपरवाइज़र को बताएँ।",
    tipOk: "अच्छा। पानी पिएँ और छाँव में आराम करें।",
    tipHot: "काम रोकें। छाँव में जाएँ। पानी पिएँ। सुपरवाइज़र को बता दिया गया है।",
    tipEmergency: "मदद बुलाई जा रही है। वहीं रुकें। अकेले न चलें।",
    again: "नई जाँच",
    sms: "एसएमएस मोड",
    kiosk: "कियोस्क मोड",
    phone: "कॉल / एसएमएस",
    smsHelp: "संदेश भेजें: आईडी फिर 1=ठीक 2=गर्मी 3=आपातकाल। उदाहरण: 482 2",
    smsWrong: "गलत प्रारूप। उदाहरण: 482 2",
    smsOk: "धन्यवाद। पानी पिएँ और छाँव में आराम करें।",
    smsHot: "काम रोकें। छाँव में जाएँ और पानी पिएँ। सुपरवाइज़र को सूचित किया गया।",
    smsEmergency: "आपातकाल मिला। मदद आ रही है। वहीं रुकें।",
    send: "भेजें",
    next_lang: "தமிழ்",
  },
  ta: {
    title: "வெப்ப பாதுகாப்பு பதிவு",
    back: "← பின்",
    enterId: "உங்கள் தொழிலாளர் எண்ணை உள்ளிடவும்",
    next: "அடுத்து",
    clear: "அழி",
    how: "நீங்கள் எப்படி உணர்கிறீர்கள்?",
    ok: "நலமாக உள்ளேன்",
    hot: "வெப்பம் / தலைசுற்றல்",
    emergency: "அவசரம்",
    done: "பதிவு அனுப்பப்பட்டது",
    failed: "அனுப்ப முடியவில்லை. மேற்பார்வையாளரிடம் சொல்லுங்கள்.",
    tipOk: "நல்லது. தண்ணீர் குடியுங்கள், நிழலில் ஓய்வெடுங்கள்.",
    tipHot: "வேலையை நிறுத்தி நிழலுக்குச் செல்லுங்கள். தண்ணீர் குடியுங்கள். மேற்பார்வையாளருக்குத் தெரிவிக்கப்பட்டது.",
    tipEmergency: "உதவி அழைக்கப்படுகிறது. இங்கேயே இருங்கள். தனியாக நடக்காதீர்கள்.",
    again: "புதிய பதிவு",
    sms: "SMS முறை",
    kiosk: "கியோஸ்க் முறை",
    phone: "அழைப்பு / SMS",
    smsHelp: "உரை: எண் பிறகு 1=நலம் 2=வெப்பம் 3=அவசரம். எ.கா: 482 2",
    smsWrong: "தவறான வடிவம். எ.கா: 482 2",
    smsOk: "நன்றி. தண்ணீர் குடியுங்கள், நிழலில் ஓய்வெடுங்கள்.",
    smsHot: "வேலையை நிறுத்துங்கள். நிழலுக்குச் சென்று தண்ணீர் குடியுங்கள். மேற்பார்வையாளருக்குத் தெரிவிக்கப்பட்டது.",
    smsEmergency: "அவசரம் பெறப்பட்டது. உதவி வருகிறது. இங்கேயே இருங்கள்.",
    send: "அனுப்பு",
    next_lang: "English",
  },
};

const NEXT_LANG = { en: "hi", hi: "ta", ta: "en" };
const SPEECH = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" };

const STATUS = {
  1: { key: "ok", color: "#16a34a", icon: "😊", tip: "tipOk", sms: "smsOk" },
  2: { key: "hot", color: "#f59e0b", icon: "🥵", tip: "tipHot", sms: "smsHot" },
  3: { key: "emergency", color: "#dc2626", icon: "🚨", tip: "tipEmergency", sms: "smsEmergency" },
};

const RISK = { ok: "Low", hot: "Medium", emergency: "High" };
const LABEL = { ok: "OK", hot: "Feeling hot / dizzy", emergency: "EMERGENCY" };

// Sends through the app's existing addReport, so it shows on the Dashboard
async function sendReport(addReport, workerId, status, channel) {
  try {
    await addReport({
      mode: "Worksite",
      title: `Worker ${workerId} · ${LABEL[status]}`,
      place: channel === "sms" ? "SMS (feature phone)" : "Shared kiosk",
      risk: RISK[status],
      notes: `channel=${channel}`,
    });
    return true;
  } catch {
    return false;
  }
}

function speak(text, lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = SPEECH[lang] || "en-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

const bigBtn = {
  fontSize: 28,
  padding: "22px 10px",
  borderRadius: 16,
  border: "none",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default function Kiosk({ go, addReport }) {
  const { lang, setLang } = useContext(LangContext);
  const [tab, setTab] = useState("phone");
  const [step, setStep] = useState("id"); // id | feel | done
  const [workerId, setWorkerId] = useState("");
  const [result, setResult] = useState(null);
  const [sent, setSent] = useState(true);
  const t = TEXT[lang] || TEXT.en;

  async function choose(code) {
    const s = STATUS[code];
    const ok = await sendReport(addReport, workerId, s.key, "kiosk");
    setSent(ok);
    setResult(code);
    setStep("done");
    speak(ok ? t[s.tip] : t.failed, lang);
  }

  function reset() {
    setWorkerId("");
    setResult(null);
    setStep("id");
  }

  return (
    <div style={{ maxWidth: tab === "phone" ? 960 : 480, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <button onClick={() => go("/")} style={{ fontSize: 16, marginBottom: 8 }}>
        {t.back}
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{t.title}</h2>
        <button onClick={() => setLang(NEXT_LANG[lang] || "en")} style={{ fontSize: 16 }}>
          {t.next_lang}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["phone", "kiosk"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            style={{
              flex: 1,
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: "2px solid #334155",
              background: tab === x ? "#334155" : "#fff",
              color: tab === x ? "#fff" : "#334155",
            }}
          >
            {t[x]}
          </button>
        ))}
      </div>

      {tab === "kiosk" && step === "id" && (
        <>
          <p style={{ fontSize: 20 }}>{t.enterId}</p>
          <div
            style={{
              fontSize: 40,
              textAlign: "center",
              letterSpacing: 8,
              minHeight: 56,
              border: "2px solid #cbd5e1",
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            {workerId || "—"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                style={{ ...bigBtn, background: "#334155" }}
                onClick={() => setWorkerId((w) => (w + n).slice(0, 6))}
              >
                {n}
              </button>
            ))}
            <button style={{ ...bigBtn, background: "#64748b", fontSize: 18 }} onClick={() => setWorkerId("")}>
              {t.clear}
            </button>
            <button
              style={{ ...bigBtn, background: "#334155" }}
              onClick={() => setWorkerId((w) => (w + "0").slice(0, 6))}
            >
              0
            </button>
            <button
              style={{ ...bigBtn, background: workerId.length >= 3 ? "#2563eb" : "#94a3b8", fontSize: 18 }}
              disabled={workerId.length < 3}
              onClick={() => setStep("feel")}
            >
              {t.next}
            </button>
          </div>
        </>
      )}

      {tab === "kiosk" && step === "feel" && (
        <>
          <p style={{ fontSize: 22 }}>{t.how}</p>
          {[1, 2, 3].map((c) => (
            <button
              key={c}
              onClick={() => choose(c)}
              style={{ ...bigBtn, background: STATUS[c].color, width: "100%", marginBottom: 12, padding: "36px 10px" }}
            >
              {STATUS[c].icon} {t[STATUS[c].key]}
            </button>
          ))}
        </>
      )}

      {tab === "kiosk" && step === "done" && result && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80 }}>{STATUS[result].icon}</div>
          <h2 style={{ color: sent ? STATUS[result].color : "#dc2626" }}>{sent ? t.done : t.failed}</h2>
          {sent && <p style={{ fontSize: 22 }}>{t[STATUS[result].tip]}</p>}
          <button style={{ ...bigBtn, background: "#2563eb", width: "100%" }} onClick={reset}>
            {t.again}
          </button>
        </div>
      )}

      {tab === "phone" && <PhoneDemo addReport={addReport} />}
    </div>
  );
}
