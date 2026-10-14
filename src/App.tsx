import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home,
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  CloudRain, 
  Sun, 
  Wind, 
  AlertTriangle, 
  Globe, 
  Search, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  Edit3, 
  Plus, 
  Trash2, 
  X, 
  Sliders, 
  Volume2, 
  VolumeX,
  Wifi, 
  Battery, 
  Signal, 
  ChevronRight, 
  BarChart2, 
  CheckCircle2, 
  Circle, 
  Maximize2, 
  Share2, 
  Zap, 
  Power, 
  RotateCcw, 
  Send,
  Navigation,
  Compass,
  Check,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Radio,
  Headphones,
  Play,
  Pause,
  Layers,
  HelpCircle,
  Clock,
  ChevronDown,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  reverseGeocodeWithGoogle, 
  GoogleLocationDetails, 
  calculateDistanceKm,
  getFallbackLocation 
} from './services/googleMapsService';
import { GoogleFarmMap } from './components/GoogleFarmMap';

interface MandiItem {
  id: number;
  crop: string;
  category: string;
  market: string;
  price: number;
  unit: string;
  change: string;
  trend: 'up' | 'down';
  status: string;
  msp?: number;
  latitude: number;
  longitude: number;
}

interface PriceHistoryDay {
  day: string;
  [key: string]: string | number;
}

interface Translations {
  [lang: string]: {
    appTitle: string;
    tagline: string;
    homeTab: string;
    mandiTab: string;
    weatherTab: string;
    advisorTab: string;
    settingsTab: string;
    heroGreeting: string;
    heroSubtitle: string;
    mandiTitle: string;
    weatherTitle: string;
    smartAdvice: string;
    searchPlaceholder: string;
    filterAll: string;
    addCropBtn: string;
    topGainers: string;
    irrigationAlert: string;
    pumpStatus: string;
    pumpOn: string;
    pumpOff: string;
    autoIrrigation: string;
    checklistTitle: string;
    askAiPlaceholder: string;
    locationPromptTitle: string;
    locationPromptSub: string;
    detectLocationBtn: string;
    locationVerifiedBadge: string;
    locatingStatus: string;
    kmAway: string;
    audioDispatchBtn: string;
    dailyBriefingTitle: string;
    listenBriefing: string;
  };
}

const INITIAL_TRANSLATIONS: Translations = {
  en: {
    appTitle: "Bolt AI",
    tagline: "Intelligent Agri Companion",
    homeTab: "Home",
    mandiTab: "Mandi Rates",
    weatherTab: "Irrigation",
    advisorTab: "Bolt Advisor",
    settingsTab: "Settings",
    heroGreeting: "Namaste, Farmer Friend! 👋",
    heroSubtitle: "Your daily regional farm insights & micro-climate advisory",
    mandiTitle: "Live Mandi Rates",
    weatherTitle: "Micro-Climate & Water",
    smartAdvice: "Bolt AI Advisor",
    searchPlaceholder: "Search crop or market...",
    filterAll: "All",
    addCropBtn: "Add Record",
    topGainers: "Top Gainers Today",
    irrigationAlert: "Irrigation Advisory",
    pumpStatus: "Smart Pump",
    pumpOn: "Running",
    pumpOff: "Standby",
    autoIrrigation: "Auto Sensor Mode",
    checklistTitle: "Today's Tasks",
    askAiPlaceholder: "Ask Bolt AI about crops, weather, rates...",
    locationPromptTitle: "Share Live Farm Location",
    locationPromptSub: "Connect to Google Maps to access verified coordinates, accurate rain forecasts, and nearby Mandis.",
    detectLocationBtn: "Detect Farm Location via Google",
    locationVerifiedBadge: "Accessed from Google Maps",
    locatingStatus: "Connecting to GPS & Google Geocoding...",
    kmAway: "km away",
    audioDispatchBtn: "Daily Audio Dispatch",
    dailyBriefingTitle: "Bolt Audio Bulletin",
    listenBriefing: "Play 30s Audio Briefing"
  },
  hi: {
    appTitle: "बोल्ट AI",
    tagline: "स्मार्ट किसान साथी",
    homeTab: "होम",
    mandiTab: "मंडी भाव",
    weatherTab: "सिंचाई सलाह",
    advisorTab: "बोल्ट सलाहकार",
    settingsTab: "सेटिंग्स",
    heroGreeting: "नमस्ते, किसान भाई! 👋",
    heroSubtitle: "आज का कृषि और मौसम अपडेट",
    mandiTitle: "लाइव मंडी भाव",
    weatherTitle: "मौसम व सिंचाई",
    smartAdvice: "बोल्ट AI सलाह",
    searchPlaceholder: "फसल या मंडी खोजें...",
    filterAll: "सभी",
    addCropBtn: "नया रिकॉर्ड",
    topGainers: "आज के शीर्ष भाव",
    irrigationAlert: "सिंचाई अलर्ट",
    pumpStatus: "स्मार्ट पंप",
    pumpOn: "चालू",
    pumpOff: "स्टैंडबाय",
    autoIrrigation: "ऑटो सेंसर मोड",
    checklistTitle: "आज के कार्य",
    askAiPlaceholder: "फसल, खाद या मंडी भाव पूछें...",
    locationPromptTitle: "लाइव खेत का स्थान साझा करें",
    locationPromptSub: "गूगल मैप्स से सटीक खेत का स्थान, स्थानीय बारिश और निकटतम मंडी प्राप्त करें।",
    detectLocationBtn: "गूगल से लाइव स्थान खोजें",
    locationVerifiedBadge: "गूगल मैप्स से सत्यापित स्थान",
    locatingStatus: "जीपीएस और गूगल से संपर्क हो रहा है...",
    kmAway: "किमी दूर",
    audioDispatchBtn: "दैनिक ऑडियो बुलेटिन",
    dailyBriefingTitle: "बोल्ट ऑडियो बुलेटिन",
    listenBriefing: "30 सेकंड का बुलेटिन सुनें"
  },
  te: {
    appTitle: "బోల్ట్ AI",
    tagline: "స్మార్ట్ వ్యవసాయ సలహాదారు",
    homeTab: "హోమ్",
    mandiTab: "ధరలు",
    weatherTab: "సాగు నీరు",
    advisorTab: "బోల్ట్ సలహా",
    settingsTab: "సెట్టింగ్స్",
    heroGreeting: "నమస్కారం, రైతు సోదరా! 👋",
    heroSubtitle: "ఈరోజు మీ వ్యవసాయ సూచనలు మరియు మార్కెట్ సమాచారం",
    mandiTitle: "లైవ్ మార్కెట్ ధరలు",
    weatherTitle: "వాతావరణం & నీటిపారుదల",
    smartAdvice: "బోల్ట్ AI సలహా",
    searchPlaceholder: "పంట లేదా మార్కెట్ వెతకండి...",
    filterAll: "అన్నీ",
    addCropBtn: "రికార్డు చేర్చు",
    topGainers: "ఈరోజు టాప్ ధరలు",
    irrigationAlert: "నీటిపారుదల సూచన",
    pumpStatus: "స్మార్ట్ మోటార్",
    pumpOn: "ఆన్",
    pumpOff: "ఆఫ్",
    autoIrrigation: "ఆటో సెన్సార్ మోడ్",
    checklistTitle: "ఈరోజు పనులు",
    askAiPlaceholder: "పంటలు, ధరల గురించి అడగండి...",
    locationPromptTitle: "లైవ్ వ్యవసాయ క్షేత్రం స్థానం",
    locationPromptSub: "గూగుల్ మ్యాప్స్ ద్వారా మీ పొలం లొకేషన్, స్థానిక వర్ష సూచనలు మరియు సమీప మార్కెట్ ధరలను తెలుసుకోండి.",
    detectLocationBtn: "గూగుల్ ద్వారా లైవ్ లొకేషన్ గుర్తించు",
    locationVerifiedBadge: "గూగుల్ మ్యాప్స్ ధృవీకరించిన లొకేషన్",
    locatingStatus: "GPS & గూగుల్ మ్యాప్స్ తో అనుసంధానిస్తోంది...",
    kmAway: "కి.మీ దూరం",
    audioDispatchBtn: "రోజువారీ ఆడియో బులెటిన్",
    dailyBriefingTitle: "బోల్ట్ ఆడియో బులెటిన్",
    listenBriefing: "30 సెకన్ల ఆడియో వినండి"
  }
};

const INITIAL_MANDI: MandiItem[] = [
  { id: 1, crop: 'Paddy (Rice)', category: 'Cereals', market: 'Warangal Mandi', price: 2320, unit: 'Quintal', change: '+4.5%', trend: 'up', status: 'High Demand', msp: 2183, latitude: 17.9689, longitude: 79.5941 },
  { id: 2, crop: 'Cotton (Kapas)', category: 'Commercial', market: 'Guntur Mandi', price: 7150, unit: 'Quintal', change: '+2.1%', trend: 'up', status: 'Hold Stock', msp: 6620, latitude: 16.3067, longitude: 80.4365 },
  { id: 3, crop: 'Tomato (Red)', category: 'Vegetables', market: 'Kolar Mandi', price: 3400, unit: 'Quintal', change: '-3.2%', trend: 'down', status: 'Sell Fast', msp: 2200, latitude: 13.1378, longitude: 78.1292 },
  { id: 4, crop: 'Chilli (Red Teja)', category: 'Spices', market: 'Khammam Mandi', price: 18400, unit: 'Quintal', change: '+6.8%', trend: 'up', status: 'Peak Demand', msp: 14500, latitude: 17.2473, longitude: 80.1514 },
  { id: 5, crop: 'Maize (Corn)', category: 'Cereals', market: 'Nizamabad Mandi', price: 2180, unit: 'Quintal', change: '-0.8%', trend: 'down', status: 'Fair Price', msp: 2090, latitude: 18.6725, longitude: 78.0941 },
  { id: 6, crop: 'Wheat (Sharbati)', category: 'Cereals', market: 'Indore Mandi', price: 2850, unit: 'Quintal', change: '+1.2%', trend: 'up', status: 'Steady Price', msp: 2275, latitude: 22.7196, longitude: 75.8577 },
  { id: 7, crop: 'Soybean (Yellow)', category: 'Pulses', market: 'Ujjain Mandi', price: 4620, unit: 'Quintal', change: '+3.0%', trend: 'up', status: 'High Demand', msp: 4600, latitude: 23.1765, longitude: 75.7885 },
  { id: 8, crop: 'Turmeric (Salem)', category: 'Spices', market: 'Nizamabad Mandi', price: 13900, unit: 'Quintal', change: '+1.8%', trend: 'up', status: 'Hold Stock', msp: 11000, latitude: 18.6725, longitude: 78.0941 }
];

const INITIAL_PRICE_HISTORY: PriceHistoryDay[] = [
  { day: 'Mon', Paddy: 2200, Cotton: 6900, Tomato: 3800, Chilli: 17200, Wheat: 2780, Maize: 2100 },
  { day: 'Tue', Paddy: 2240, Cotton: 7000, Tomato: 3600, Chilli: 17500, Wheat: 2800, Maize: 2120 },
  { day: 'Wed', Paddy: 2280, Cotton: 6980, Tomato: 3500, Chilli: 17800, Wheat: 2820, Maize: 2150 },
  { day: 'Thu', Paddy: 2300, Cotton: 7050, Tomato: 3450, Chilli: 18000, Wheat: 2840, Maize: 2160 },
  { day: 'Fri', Paddy: 2320, Cotton: 7150, Tomato: 3400, Chilli: 18400, Wheat: 2850, Maize: 2180 }
];

const HOURLY_WEATHER = [
  { time: '12 PM', temp: '31°', rain: 15 },
  { time: '1 PM', temp: '30°', rain: 35 },
  { time: '2 PM', temp: '29°', rain: 60 },
  { time: '3 PM', temp: '27°', rain: 85, alert: true },
  { time: '4 PM', temp: '26°', rain: 70 },
  { time: '5 PM', temp: '26°', rain: 30 },
  { time: '6 PM', temp: '25°', rain: 10 }
];

const POPULAR_AGRI_REGIONS = [
  { name: 'Warangal Rural, Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Guntur Rural, Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Kolar Agro Belt, Karnataka', lat: 13.1378, lng: 78.1292 },
  { name: 'Nashik Grape Belt, Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Nizamabad, Telangana', lat: 18.6725, lng: 78.0941 },
  { name: 'Indore Malwa Region, MP', lat: 22.7196, lng: 75.8577 }
];

// INNOVATIVE 1-TAP SMART AGRO PROMPTS (Replacing flaky speech-to-text)
const SMART_AGRO_QUERIES = [
  {
    id: 'rain-spray',
    icon: '🌧️',
    title: 'Rain & Chemical Spraying',
    question: 'Will rain wash away pesticide or fertilizer sprays today?',
    tag: 'Weather Risk'
  },
  {
    id: 'mandi-timing',
    icon: '💰',
    title: 'Market Timing: Sell vs Hold',
    question: 'Should I sell Paddy and Chilli now or hold stock?',
    tag: 'Market Strategy'
  },
  {
    id: 'irrigation-timing',
    icon: '💧',
    title: 'Irrigation & Pump Advice',
    question: 'When is the optimal time to run my submersible pump today?',
    tag: 'Water Management'
  },
  {
    id: 'fertilizer-schedule',
    icon: '🧪',
    title: 'Post-Rain Fertilizer Dose',
    question: 'What is the recommended Urea & Potash dose after rain?',
    tag: 'Nutrients'
  },
  {
    id: 'cotton-pest',
    icon: '🐛',
    title: 'Cotton Pest Prevention',
    question: 'How do I protect cotton against pink bollworm in humid weather?',
    tag: 'Crop Health'
  },
  {
    id: 'msp-support',
    icon: '🏛️',
    title: 'Government MSP Benchmark',
    question: 'What are current government Minimum Support Prices for my crops?',
    tag: 'MSP Rates'
  }
];

export default function App() {
  const [lang, setLang] = useState<'en' | 'hi' | 'te'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'mandi' | 'weather' | 'advisor' | 'settings'>('home');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [frameView, setFrameView] = useState<boolean>(true);

  // Dynamic state
  const [translations, setTranslations] = useState<Translations>(INITIAL_TRANSLATIONS);
  const [mandiData, setMandiData] = useState<MandiItem[]>(INITIAL_MANDI);
  const [priceHistory] = useState<PriceHistoryDay[]>(INITIAL_PRICE_HISTORY);

  // Live Location & Google Maps State
  const [locationStatus, setLocationStatus] = useState<'unrequested' | 'locating' | 'accessed' | 'error'>('unrequested');
  const [googleLocation, setGoogleLocation] = useState<GoogleLocationDetails | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Filters & Selected item for charts
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedCropChart, setSelectedCropChart] = useState<string>('Paddy');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-desc' | 'change-desc' | 'nearest'>('default');

  // Weather & Irrigation State
  const [weatherData, setWeatherData] = useState({
    location: "Warangal Rural, TS",
    temp: "29°C",
    condition: "Rain Shower at 3 PM",
    humidity: "82%",
    wind: "14 km/h",
    rainProb: "75%",
    soilMoisture: "68%",
    advisoryTitle: "Hold Off Irrigation Today",
    advisoryText: "High soil moisture (68%) and 75% afternoon shower expected at 3:00 PM. Delay pump cycle to conserve power and avoid waterlogging."
  });

  // Smart Pump State
  const [pumpActive, setPumpActive] = useState<boolean>(false);
  const [autoMode, setAutoMode] = useState<boolean>(true);

  // Tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: "Delay irrigation for Field A (Rain expected at 3 PM)", done: true },
    { id: 2, text: "Drain excess runoff channel around tomato beds", done: false },
    { id: 3, text: "Transport 15 Quintals Chilli to Khammam Mandi", done: false }
  ]);

  // INNOVATIVE AUDIO DISPATCH & AUDIO BULLETIN (Reliable Replacement for Speech Detection)
  const [audioDispatchOpen, setAudioDispatchOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRate, setAudioRate] = useState<number>(1.0);
  const [activeAudioTopic, setActiveAudioTopic] = useState<'all' | 'weather' | 'mandi' | 'tasks'>('all');
  const [currentTime, setCurrentTime] = useState('');

  // AI Advisor Chat
  const [advisorInput, setAdvisorInput] = useState('');
  const [showQueryPalette, setShowQueryPalette] = useState(false);
  const [advisorHistory, setAdvisorHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: "Namaste! I am Bolt AI. Tap any quick query card or use the Audio Dispatch for an instant farm briefing." 
    }
  ]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropForm, setNewCropForm] = useState({
    crop: '',
    category: 'Cereals',
    market: '',
    price: 2500,
    unit: 'Quintal',
    change: '+2.0%',
    trend: 'up' as 'up' | 'down',
    status: 'High Demand'
  });
  const [showCallModal, setShowCallModal] = useState(false);
  const [shareToast, setShareToast] = useState('');

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = translations[lang] || translations.en;

  // SPEECH SYNTHESIS ENGINE (100% Reliable Output, Never Fails Mic Permissions)
  const speakText = (text: string, rate: number = audioRate) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';

      utterance.rate = rate;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // INNOVATIVE 1-TAP AUDIO DISPATCH GENERATOR
  const getAudioDispatchScript = (topic: 'all' | 'weather' | 'mandi' | 'tasks' = 'all') => {
    const loc = googleLocation?.villageOrLocality || "Warangal Rural";
    const topCrop = mandiData[0] || { crop: 'Paddy', market: 'Warangal', price: 2320, unit: 'Quintal' };

    if (lang === 'hi') {
      if (topic === 'weather') return `${loc} में आज दोपहर 3 बजे 75% बारिश का अनुमान है। मिट्टी में 68% नमी है। सिंचाई रोकें।`;
      if (topic === 'mandi') return `${topCrop.market} में ${topCrop.crop} का भाव ₹${topCrop.price} प्रति क्विंटल है, जिसमें 4.5% की बढ़त है।`;
      if (topic === 'tasks') return `आज का मुख्य कार्य: 3 बजे से पहले खेत की जल निकासी नाली साफ करें और यूरिया छिड़काव बारिश के बाद करें।`;
      return `नमस्ते किसान भाई! बोल्ट AI ऑडियो बुलेटिन: ${loc} में दोपहर 3 बजे 75% बारिश का अनुमान है। आज सिंचाई टालें। मंडी भाव में ${topCrop.crop} ₹${topCrop.price} पर मजबूत है। शुभ दिन!`;
    }

    if (lang === 'te') {
      if (topic === 'weather') return `${loc} లో మధ్యాహ్నం 3 గంటలకు 75% వర్షం పడే అవకాశం ఉంది. నీటిపారుదల నిలిపివేయండి.`;
      if (topic === 'mandi') return `${topCrop.market} లో ${topCrop.crop} ధర ₹${topCrop.price}. మార్కెట్లో మంచి డిమాండ్ ఉంది.`;
      if (topic === 'tasks') return `ఈరోజు ముఖ్యమైన పని: వర్షానికి ముందే పొలంలో మురుగు నీరు పోయే మార్గాన్ని సిద్ధం చేయండి.`;
      return `నమస్కారం రైతు సోదరా! బోल्ट AI ఆడియో సమాచారం: ${loc} లో మధ్యాహ్నం 3 గంటలకు వర్షం పడవచ్చు. నీరు పెట్టడం ఆపండి. మార్కెట్లో ${topCrop.crop} ధర ₹${topCrop.price} వద్ద సానుకూలంగా ఉంది.`;
    }

    // English
    if (topic === 'weather') return `Micro-climate report for ${loc}: 75% shower probability at 3 PM with 68% soil moisture. Hold off irrigation today.`;
    if (topic === 'mandi') return `Market alert: ${topCrop.crop} at ${topCrop.market} is trading higher at ₹${topCrop.price} per ${topCrop.unit}, up 4.5%.`;
    if (topic === 'tasks') return `Priority farm task: Inspect field runoff channels before 3 PM rain and delay fertilizer application until evening.`;
    return `Namaste! Here is your Bolt AI Daily Dispatch for ${loc}. High shower probability of 75% is forecast at 3:00 PM. Hold off irrigation to conserve power. In Mandi news, ${topCrop.crop} is up 4.5% at ₹${topCrop.price}. Have a productive farming day!`;
  };

  const handlePlayAudioDispatch = (topic: 'all' | 'weather' | 'mandi' | 'tasks' = activeAudioTopic) => {
    setActiveAudioTopic(topic);
    if (isPlayingAudio) {
      stopSpeaking();
    } else {
      const script = getAudioDispatchScript(topic);
      speakText(script, audioRate);
    }
  };

  // SHARE AUDIO BULLETIN ON WHATSAPP
  const handleShareBulletin = () => {
    const loc = googleLocation?.villageOrLocality || "Warangal Rural";
    const script = getAudioDispatchScript('all');
    const text = `⚡ *Bolt AI Daily Farm Dispatch*\n📍 ${loc}\n\n${script}\n\nShared via Bolt AI Smart Farming Companion`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareToast("Copied Daily Bulletin! Ready to paste on WhatsApp.");
      setTimeout(() => setShareToast(''), 3000);
    }
  };

  // CORE GOOGLE LOCATION FLOW
  const requestFarmerLiveLocation = () => {
    setLocationStatus('locating');
    setLocationError('');

    if (!navigator.geolocation) {
      fallbackToDefaultGoogleLocation("Browser does not support direct GPS. Using Google Regional Location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          const details = await reverseGeocodeWithGoogle(latitude, longitude);
          details.accuracy = Math.round(accuracy) || 12;
          applyGoogleLocation(details);
        } catch (err) {
          console.error("Google Geocoding error:", err);
          const fallback = getFallbackLocation(latitude, longitude);
          applyGoogleLocation(fallback);
        }
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        setLocationStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission was blocked in your browser. Choose an agricultural region below or enable GPS.");
        } else {
          setLocationError("GPS signal timed out. Selected regional Google agricultural hub.");
          fallbackToDefaultGoogleLocation("Using Google Warangal Rural Station.");
        }
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  };

  const applyGoogleLocation = (details: GoogleLocationDetails) => {
    setGoogleLocation(details);
    setLocationStatus('accessed');
    setShowLocationModal(false);

    const label = `${details.villageOrLocality}, ${details.state}`;
    setWeatherData(prev => ({
      ...prev,
      location: label
    }));

    setShareToast(`✓ Farm location accessed from Google: ${details.villageOrLocality}`);
    setTimeout(() => setShareToast(''), 3500);

    const locationGreet = lang === 'hi'
      ? `गूगल मैप्स द्वारा आपका खेत स्थान "${details.villageOrLocality}, ${details.district}" पर पाया गया। 3 बजे बारिश के चलते सिंचाई रोकें।`
      : lang === 'te'
      ? `గూగుల్ మ్యాప్స్ ద్వారా మీ పొలం "${details.villageOrLocality}, ${details.district}" గా గుర్తించబడింది. 3 గంటలకు వర్షం పడే అవకాశం ఉంది.`
      : `Google Maps verified your farm location at ${details.villageOrLocality}, ${details.district}. Today's afternoon rain probability is 75% at 3 PM.`;

    setAdvisorHistory(prev => [
      ...prev,
      { sender: 'ai', text: locationGreet }
    ]);
  };

  const fallbackToDefaultGoogleLocation = (msg?: string) => {
    const defaultCoords = { lat: 17.9689, lng: 79.5941 };
    reverseGeocodeWithGoogle(defaultCoords.lat, defaultCoords.lng).then(details => {
      applyGoogleLocation(details);
      if (msg) setShareToast(msg);
    });
  };

  const selectPredefinedRegion = async (reg: typeof POPULAR_AGRI_REGIONS[0]) => {
    setLocationStatus('locating');
    const details = await reverseGeocodeWithGoogle(reg.lat, reg.lng);
    applyGoogleLocation(details);
  };

  const handleTranslationChange = (key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  const handleAddMandi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropForm.crop || !newCropForm.market) return;
    const newCrop: MandiItem = {
      id: Date.now(),
      crop: newCropForm.crop,
      category: newCropForm.category,
      market: newCropForm.market,
      price: Number(newCropForm.price) || 2000,
      unit: newCropForm.unit || 'Quintal',
      change: newCropForm.change || '+1.0%',
      trend: newCropForm.trend,
      status: newCropForm.status,
      msp: Math.round(Number(newCropForm.price) * 0.92),
      latitude: googleLocation?.latitude || 17.9689,
      longitude: googleLocation?.longitude || 79.5941
    };
    setMandiData([newCrop, ...mandiData]);
    setShowAddModal(false);
  };

  const handleDeleteMandi = (id: number) => {
    setMandiData(mandiData.filter(item => item.id !== id));
  };

  const handleTaskToggle = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Filtered Mandi
  const filteredMandiData = useMemo(() => {
    let list = mandiData.filter(item => {
      const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.market.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'change-desc') {
      list = [...list].sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
    } else if (sortOrder === 'nearest' && googleLocation) {
      list = [...list].sort((a, b) => {
        const distA = calculateDistanceKm(googleLocation.latitude, googleLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistanceKm(googleLocation.latitude, googleLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    }
    return list;
  }, [mandiData, searchQuery, categoryFilter, sortOrder, googleLocation]);

  const handleSendAdvisor = (queryText?: string) => {
    const textToSend = queryText || advisorInput;
    if (!textToSend.trim()) return;

    setAdvisorHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
    setAdvisorInput('');
    setShowQueryPalette(false);

    setTimeout(() => {
      let reply = "";
      const lower = textToSend.toLowerCase();
      const locName = googleLocation?.villageOrLocality || "your region";
      if (lower.includes('water') || lower.includes('irrigation') || lower.includes('rain')) {
        reply = lang === 'hi'
          ? `${locName} में दोपहर 3 बजे 75% बारिश की संभावना है और मिट्टी में 68% नमी है। आज सिंचाई रोकें और जल निकासी बनाए रखें।`
          : lang === 'te'
          ? `${locName} లో మధ్యాహ్నం 3 గంటలకు 75% వర్షం పడే అవకాశం ఉంది. నేలలో 68% తేమ ఉంది కాబట్టి నీరు పెట్టడం ఆపండి.`
          : `For ${locName}, heavy afternoon shower (75% probability) is expected at 3:00 PM. Delay irrigation today to prevent root rot and save electricity.`;
      } else if (lower.includes('price') || lower.includes('mandi') || lower.includes('sell') || lower.includes('chilli') || lower.includes('cotton')) {
        reply = lang === 'hi'
          ? "निकटवर्ती मंडियों में लाल मिर्च और धान में अच्छी तेजी है। टमाटर की आवक ज्यादा होने से तैयार माल जल्दी निकालें।"
          : lang === 'te'
          ? "సమీప మార్కెట్లలో మిర్చి మరియు ధాన్యానికి మంచి డిమాండ్ ఉంది. టమాటాలను త్వరగా మార్కెట్ చేయండి."
          : "Nearby Mandis report strong buying for Red Chilli and Paddy. We advise holding Chilli for peak rates, while dispatching fresh Tomato quickly.";
      } else if (lower.includes('fertilizer') || lower.includes('urea') || lower.includes('dose')) {
        reply = lang === 'hi'
          ? "फसल में कल्ले फूटने के समय 25 किग्रा यूरिया प्रति एकड़ बारिश थमने के बाद ही डालें। गीली या जलभराव वाली जमीन पर न डालें।"
          : lang === 'te'
          ? "ఎకరాకు 25 కిలోల యూరియా వర్షం తగ్గిన తర్వాతే వేయండి. మురుగు నీరు నిలిచిన నేలలో ఎరువులు చల్లవద్దు."
          : "Apply top-dressing urea (25kg/acre) strictly after the afternoon rain stops. Avoid broadcasting on saturated soil to avoid nutrient runoff.";
      } else if (lower.includes('msp') || lower.includes('support')) {
        reply = `Government MSP benchmarks: Paddy (Common) ₹2,183/Q, Cotton (Medium) ₹6,620/Q, Soybean ₹4,600/Q, Wheat ₹2,275/Q. You are receiving competitive rates in local APMCs.`;
      } else {
        reply = `Bolt AI (${locName}): For "${textToSend}", current micro-climate and Google satellite readings suggest maintaining balanced nutrition and monitoring drainage.`;
      }

      setAdvisorHistory(prev => [...prev, { sender: 'ai', text: reply }]);
      speakText(reply, audioRate);
    }, 450);
  };

  const handleShareMandi = (item: MandiItem) => {
    const distText = googleLocation 
      ? ` (~${calculateDistanceKm(googleLocation.latitude, googleLocation.longitude, item.latitude, item.longitude)} km from farm)` 
      : '';
    const text = `⚡ *Bolt AI Mandi Alert*\n${item.crop} @ ${item.market}${distText}: ₹${item.price}/${item.unit} (${item.change})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareToast(`Copied rate for ${item.crop}!`);
      setTimeout(() => setShareToast(''), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-0 sm:p-4 font-sans antialiased select-none">
      
      {/* Top Presentation Bar */}
      <div className="w-full max-w-sm mb-2.5 hidden sm:flex items-center justify-between text-xs text-stone-400 px-3">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-white tracking-wide">Bolt AI</span>
          <span className="text-[10px] text-amber-300/90 font-semibold bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">by team 11</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/bolt-ai-project.zip"
            download="bolt-ai-project.zip"
            className="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            title="Download full project zip to run on laptop"
          >
            <Download className="w-3 h-3" />
            <span>Download ZIP</span>
          </a>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 text-[11px] ${
              editMode ? 'bg-amber-400 text-stone-900 font-bold' : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            {editMode ? 'Edit Active' : 'Edit Mode'}
          </button>
          <button
            onClick={() => setFrameView(!frameView)}
            className="p-1.5 bg-stone-900 border border-stone-800 rounded-lg hover:bg-stone-800 text-stone-300 transition"
            title="Toggle Phone Frame"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MOBILE DEVICE CONTAINER */}
      <div 
        className={`w-full max-w-sm bg-stone-50 text-stone-900 flex flex-col relative overflow-hidden transition-all duration-300 ${
          frameView 
            ? 'sm:rounded-[40px] sm:shadow-[0_20px_50px_rgba(0,0,0,0.7)] sm:border-[8px] sm:border-stone-800 h-[820px]' 
            : 'h-screen sm:h-[820px] sm:rounded-2xl'
        }`}
      >

        {/* STATUS BAR */}
        <div className="bg-stone-950 text-white px-5 pt-3 pb-2 flex items-center justify-between text-xs font-medium shrink-0 z-50">
          <span className="tracking-tight font-semibold text-[11px]">{currentTime || '09:41'}</span>
          <div className="w-16 h-3.5 bg-black rounded-full hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-stone-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* APP HEADER */}
        <header className="bg-stone-900 text-white px-4 py-2.5 flex items-center justify-between shrink-0 z-40 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 p-1.5 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black leading-tight tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                  by team 11
                </span>
              </div>
              {/* Clickable Location Chip */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 transition"
                title="Tap to view or change Google farm location"
              >
                <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[110px]">
                  {googleLocation?.villageOrLocality || weatherData.location}
                </span>
                {googleLocation && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
              {(['en', 'hi', 'te'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition ${
                    lang === l ? 'bg-amber-400 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'తె'}
                </button>
              ))}
            </div>

            {/* INNOVATIVE: 1-Tap Daily Audio Dispatch Button (Replaces flaky voice detect) */}
            <button
              onClick={() => {
                setAudioDispatchOpen(!audioDispatchOpen);
                if (!audioDispatchOpen && !isPlayingAudio) {
                  handlePlayAudioDispatch('all');
                }
              }}
              aria-label="Open Daily Audio Dispatch"
              className={`px-2 py-1 rounded-xl transition flex items-center gap-1.5 border shadow-xs ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-stone-950 border-amber-300 animate-pulse' 
                  : audioDispatchOpen
                  ? 'bg-stone-800 text-amber-400 border-amber-400/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
              title="Daily Audio Dispatch"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold">Audio</span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* INNOVATIVE: BOLT AUDIO DISPATCH DRAWER (Kisan Radio / Spoken Farm Bulletin) */}
        {/* ========================================================================= */}
        {audioDispatchOpen && (
          <div className="bg-stone-900 text-white border-b border-stone-800 p-3.5 space-y-2.5 z-40 shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {t.dailyBriefingTitle}
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-400/30">
                      LIVE
                    </span>
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Targeted for {googleLocation?.villageOrLocality || "Warangal"} • In {lang.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Audio Speed Toggle */}
                <button
                  onClick={() => {
                    const next = audioRate === 1.0 ? 1.25 : audioRate === 1.25 ? 1.5 : 1.0;
                    setAudioRate(next);
                  }}
                  className="px-1.5 py-0.5 rounded bg-stone-800 text-[9px] font-bold text-stone-300 hover:bg-stone-700"
                  title="Playback Speed"
                >
                  {audioRate}x
                </button>
                <button 
                  onClick={() => {
                    stopSpeaking();
                    setAudioDispatchOpen(false);
                  }}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Live Audio Waveform */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudioDispatch()}
                  className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center transition shadow-xs"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
                </button>
                <div>
                  <p className="text-[11px] font-bold text-stone-200">
                    {isPlayingAudio ? "Broadcasting Farm Bulletin..." : "Ready to Play"}
                  </p>
                  <p className="text-[9px] text-stone-400">
                    {activeAudioTopic === 'all' ? "Comprehensive 30s farm update" : `Focus: ${activeAudioTopic}`}
                  </p>
                </div>
              </div>

              {/* Animated Wave Bars */}
              <div className="flex items-center gap-1 h-5 px-2">
                {[6, 12, 18, 10, 16, 22, 14, 8].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-amber-400' : 'bg-stone-700'
                    }`}
                    style={{ 
                      height: isPlayingAudio ? `${Math.max(4, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '4px' 
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
              {[
                { id: 'all', label: 'Full Bulletin' },
                { id: 'weather', label: '🌧️ Weather & Rain' },
                { id: 'mandi', label: '💰 Mandi Rates' },
                { id: 'tasks', label: '📋 Action Tasks' }
              ].map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handlePlayAudioDispatch(topic.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition border ${
                    activeAudioTopic === topic.id
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* WhatsApp Share Button */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[10px]">
              <span className="text-stone-400">Zero mic typing needed</span>
              <button
                onClick={handleShareBulletin}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                <span>Share to WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {shareToast && (
          <div className="bg-stone-900 text-white text-[11px] font-medium px-3 py-1.5 flex items-center justify-between shrink-0 shadow-sm border-b border-stone-800">
            <span className="flex items-center gap-1.5 text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {shareToast}
            </span>
            <button onClick={() => setShareToast('')}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-stone-50 pb-20">
          
          {/* ========================================================================= */}
          {/* FARMER LIVE LOCATION ACCESS INTERFACE (Ask Location & Display from Google) */}
          {/* ========================================================================= */}

          {/* STATE 1: Unrequested / Not yet accessed -> Prompt Farmer */}
          {locationStatus === 'unrequested' && (
            <div className="bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-950 text-white p-4 rounded-2xl border border-amber-500/30 shadow-md space-y-3 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                    <Navigation className="w-5 h-5 fill-stone-950" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">{t.locationPromptTitle}</h3>
                    <p className="text-[10px] text-amber-300 font-semibold">Google Maps Geocoding</p>
                  </div>
                </div>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                  GPS Ready
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                {t.locationPromptSub}
              </p>

              {/* Primary Ask Location CTA */}
              <button
                onClick={requestFarmerLiveLocation}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
              >
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>{t.detectLocationBtn}</span>
              </button>

              {/* Quick Regional Pickers */}
              <div className="pt-2 border-t border-stone-800">
                <p className="text-[10px] text-stone-400 font-medium mb-1.5">Or quick-select agricultural district:</p>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  {POPULAR_AGRI_REGIONS.slice(0, 4).map(reg => (
                    <button
                      key={reg.name}
                      onClick={() => selectPredefinedRegion(reg)}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] px-2.5 py-1 rounded-lg whitespace-nowrap border border-stone-700 transition"
                    >
                      {reg.name.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Locating */}
          {locationStatus === 'locating' && (
            <div className="bg-stone-900 text-white p-4 rounded-2xl border border-amber-400/40 shadow-md text-center space-y-2.5 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                <Compass className="w-5 h-5 animate-spin" />
              </div>
              <h3 className="text-xs font-bold text-white">{t.locatingStatus}</h3>
              <p className="text-[10px] text-stone-400">
                Contacting device GPS sensor & retrieving Google Maps reverse geocoding data...
              </p>
            </div>
          )}

          {/* STATE 3: Location Accessed & Verified from Google */}
          {locationStatus === 'accessed' && googleLocation && (
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {t.locationVerifiedBadge}
                    </span>
                    <h3 className="text-xs font-extrabold text-stone-900 leading-tight">
                      {googleLocation.villageOrLocality}, {googleLocation.district}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-[10px] text-stone-500 hover:text-stone-800 font-semibold px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 transition"
                >
                  Change
                </button>
              </div>

              {/* Full Address Returned by Google */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-[11px] text-stone-600 leading-snug">
                <p className="font-medium text-stone-800">{googleLocation.formattedAddress}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1 pt-1 border-t border-stone-200/60">
                  <span>GPS: {googleLocation.latitude.toFixed(4)}° N, {googleLocation.longitude.toFixed(4)}° E</span>
                  <span className="text-emerald-700 font-bold">Accuracy: ±{googleLocation.accuracy}m</span>
                </div>
              </div>

              {/* Embedded Interactive Google Map Preview */}
              <GoogleFarmMap
                latitude={googleLocation.latitude}
                longitude={googleLocation.longitude}
                formattedAddress={googleLocation.formattedAddress}
                onRefresh={requestFarmerLiveLocation}
              />
            </div>
          )}

          {/* STATE 4: Location Error */}
          {locationStatus === 'error' && (
            <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>GPS Location Access Needed</span>
              </div>
              <p className="text-[11px] text-amber-800">{locationError}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={requestFarmerLiveLocation}
                  className="px-3 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg text-[10px]"
                >
                  Retry GPS
                </button>
                <button
                  onClick={() => fallbackToDefaultGoogleLocation()}
                  className="px-3 py-1 bg-stone-900 text-white font-bold rounded-lg text-[10px]"
                >
                  Use Default Google Region
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 1: HOME ==================== */}
          {activeTab === 'home' && (
            <div className="space-y-3">
              
              {/* Clean Hero Card */}
              <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-sm space-y-3 border border-stone-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-300">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{googleLocation?.villageOrLocality || weatherData.location}</span>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                    Live Farm Advisory
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">{t.heroGreeting}</h2>
                  <p className="text-xs text-stone-400 mt-0.5">{t.heroSubtitle}</p>
                </div>

                {/* 3 Clean Quick Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-center">
                  <div className="bg-stone-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-stone-400">Paddy Rate</p>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">₹2,320</p>
                    <span className="text-[9px] text-emerald-400 font-semibold">+4.5%</span>
                  </div>
                  <div className="bg-stone-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-stone-400">Rain Alert</p>
                    <p className="text-xs font-bold text-white mt-0.5">3:00 PM</p>
                    <span className="text-[9px] text-blue-400 font-semibold">75% risk</span>
                  </div>
                  <div className="bg-stone-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-stone-400">Soil Moisture</p>
                    <p className="text-xs font-bold text-white mt-0.5">68%</p>
                    <span className="text-[9px] text-emerald-400 font-semibold">Adequate</span>
                  </div>
                </div>
              </div>

              {/* 1-Tap Daily Audio Dispatch Shortcut Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 to-stone-900 border border-amber-500/30 p-3 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 dark:text-white">Daily Audio Dispatch</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-300">
                      30-sec spoken update in {lang.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAudioDispatchOpen(true);
                    handlePlayAudioDispatch('all');
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-stone-950" />
                  <span>Play</span>
                </button>
              </div>

              {/* Clean Advisory Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-stone-900">{weatherData.advisoryTitle}</span>
                  </div>
                  <button 
                    onClick={() => speakText(weatherData.advisoryText, audioRate)} 
                    className="text-[11px] text-amber-600 font-bold hover:text-amber-700 flex items-center gap-0.5"
                  >
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {weatherData.advisoryText}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px] text-stone-500">
                  <span>Recommendation: Hold irrigation cycle</span>
                  <button 
                    onClick={() => setActiveTab('weather')} 
                    className="text-stone-800 font-bold hover:underline"
                  >
                    Pump & Weather →
                  </button>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900">{t.checklistTitle}</h3>
                  <span className="text-[10px] text-stone-500">
                    {tasks.filter(t => t.done).length}/{tasks.length} Done
                  </span>
                </div>

                <div className="space-y-1.5">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => handleTaskToggle(task.id)}
                      className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-100 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        {task.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        )}
                        <span className={`text-xs ${task.done ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}`}>
                          {task.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Mandi Gainer Snapshot */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900">{t.topGainers}</h3>
                  <button onClick={() => setActiveTab('mandi')} className="text-[11px] text-amber-600 font-bold hover:underline">
                    View All →
                  </button>
                </div>

                <div className="space-y-1.5">
                  {mandiData.slice(0, 3).map(crop => {
                    const distance = googleLocation 
                      ? calculateDistanceKm(googleLocation.latitude, googleLocation.longitude, crop.latitude, crop.longitude)
                      : null;
                    return (
                      <div key={crop.id} className="p-2 rounded-xl bg-stone-50 flex items-center justify-between border border-stone-100">
                        <div>
                          <p className="text-xs font-bold text-stone-800">{crop.crop}</p>
                          <p className="text-[10px] text-stone-500">
                            {crop.market} {distance !== null && `• ${distance} km`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-stone-900">₹{crop.price.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold ${crop.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {crop.change}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team 11 Credit Tag */}
              <div className="text-center pt-1 pb-1">
                <span className="text-[10px] text-stone-400 font-medium">
                  ⚡ Bolt AI • by team 11
                </span>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: MANDI RATES ==================== */}
          {activeTab === 'mandi' && (
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-stone-900">{t.mandiTitle}</h2>
                  <p className="text-[10px] text-stone-500">
                    {googleLocation ? `Distances calculated from your farm` : `Live APMC & e-NAM updates`}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addCropBtn}</span>
                </button>
              </div>

              {/* Clean Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-200 pl-8 pr-8 py-1.5 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-stone-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills & Nearest Sort */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                <div className="flex items-center gap-1.5">
                  {['All', 'Cereals', 'Commercial', 'Vegetables', 'Spices'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] font-semibold transition ${
                        categoryFilter === cat 
                          ? 'bg-stone-900 text-white' 
                          : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {cat === 'All' ? t.filterAll : cat}
                    </button>
                  ))}
                </div>

                {googleLocation && (
                  <button
                    onClick={() => setSortOrder(sortOrder === 'nearest' ? 'default' : 'nearest')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition border ${
                      sortOrder === 'nearest'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    Nearest Mandis
                  </button>
                )}
              </div>

              {/* Trend Chart */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">5-Day Rate Trend</span>
                  <select
                    value={selectedCropChart}
                    onChange={(e) => setSelectedCropChart(e.target.value)}
                    className="bg-stone-50 border border-stone-200 text-stone-700 text-[10px] font-semibold rounded-lg px-2 py-0.5 focus:outline-none"
                  >
                    <option value="Paddy">Paddy (Rice)</option>
                    <option value="Cotton">Cotton (Kapas)</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Chilli">Chilli (Red)</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div className="h-32 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1c1917', 
                          borderRadius: '8px', 
                          border: 'none', 
                          color: '#fff', 
                          fontSize: '11px',
                          padding: '4px 8px' 
                        }}
                        formatter={(value: any) => [`₹${value}`, selectedCropChart]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={selectedCropChart} 
                        stroke="#f59e0b" 
                        strokeWidth={2} 
                        dot={{ r: 2.5, fill: '#f59e0b' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mandi Cards List */}
              <div className="space-y-1.5">
                {filteredMandiData.map((item, idx) => {
                  const dist = googleLocation 
                    ? calculateDistanceKm(googleLocation.latitude, googleLocation.longitude, item.latitude, item.longitude)
                    : null;
                  return (
                    <div 
                      key={item.id}
                      className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs space-y-1.5 hover:border-stone-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-stone-900">{item.crop}</h3>
                            <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-medium">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                            <span>{item.market}</span>
                            {dist !== null && (
                              <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                                {dist} {t.kmAway}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <p className="text-xs font-bold text-stone-900">
                              ₹{item.price.toLocaleString()}
                            </p>
                            <span className="text-[9px] text-stone-400">/{item.unit}</span>
                          </div>
                          <span className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                            item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {item.change}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px]">
                        <span className="text-stone-500">{item.status}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleShareMandi(item)}
                            className="p-1 rounded text-stone-400 hover:text-stone-800 transition"
                            title="Share"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                          {editMode && (
                            <button
                              onClick={() => handleDeleteMandi(item.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================== TAB 3: MICRO-CLIMATE & IRRIGATION ==================== */}
          {activeTab === 'weather' && (
            <div className="space-y-3">
              
              <div>
                <h2 className="text-sm font-bold text-stone-900">{t.weatherTitle}</h2>
                <p className="text-[10px] text-stone-500">
                  {googleLocation ? `Hyperlocal station for ${googleLocation.villageOrLocality}` : `Micro-climate & irrigation control`}
                </p>
              </div>

              {/* Weather Card */}
              <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-sm space-y-3 border border-stone-800">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> 
                    {googleLocation?.villageOrLocality || weatherData.location}
                  </span>
                  <span>Rain Risk {weatherData.rainProb}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">{weatherData.temp}</h3>
                    <p className="text-xs text-stone-300 mt-0.5">{weatherData.condition}</p>
                  </div>
                  <CloudRain className="w-8 h-8 text-blue-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400">Humidity</span>
                    <p className="font-bold text-white">{weatherData.humidity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Wind</span>
                    <p className="font-bold text-white">{weatherData.wind}</p>
                  </div>
                </div>
              </div>

              {/* Google Map Mini View in Weather */}
              {googleLocation && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">Google Satellite Soil Plot</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Google Pin Active</span>
                  </div>
                  <GoogleFarmMap
                    latitude={googleLocation.latitude}
                    longitude={googleLocation.longitude}
                    formattedAddress={googleLocation.formattedAddress}
                  />
                </div>
              )}

              {/* Hourly Rain Timeline */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Hourly Rain Probability</span>
                  <span className="text-blue-600 font-bold text-[10px]">Shower at 3 PM</span>
                </div>

                <div className="grid grid-cols-7 gap-1 pt-1">
                  {HOURLY_WEATHER.map((slot, index) => (
                    <div 
                      key={index} 
                      className={`text-center p-1.5 rounded-lg border text-xs ${
                        slot.alert 
                          ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                          : 'bg-stone-50 border-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-[9px] block">{slot.time}</span>
                      <span className="text-[10px] font-bold block mt-1">{slot.rain}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Soil Moisture Telemetry</span>
                  <span className="font-bold text-emerald-600 text-[10px]">68% Optimal</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-600 mb-0.5">
                      <span>Field A (Main Plot)</span>
                      <span className="font-bold">68%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-stone-600 mb-0.5">
                      <span>Field B (Ridge Zone)</span>
                      <span className="font-bold">54%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div className="bg-stone-400 h-1.5 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Smart Pump Control */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{t.pumpStatus}</p>
                    <p className="text-[10px] text-stone-500">
                      Status: <strong className={pumpActive ? 'text-emerald-600' : 'text-stone-600'}>
                        {pumpActive ? t.pumpOn : t.pumpOff}
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setPumpActive(!pumpActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      pumpActive ? 'bg-rose-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{pumpActive ? 'Stop' : 'Start'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                  <span className="text-[11px] text-stone-600">{t.autoIrrigation}</span>
                  <button
                    onClick={() => setAutoMode(!autoMode)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                      autoMode ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-xs"></div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 4: BOLT ADVISOR ==================== */}
          {activeTab === 'advisor' && (
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-stone-900">{t.smartAdvice}</h2>
                  <p className="text-[10px] text-stone-500">
                    {googleLocation ? `Tuned to Google location: ${googleLocation.villageOrLocality}` : `Fast agronomic intelligence`}
                  </p>
                </div>
                
                {/* Palette Toggle */}
                <button
                  onClick={() => setShowQueryPalette(!showQueryPalette)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-[11px] flex items-center gap-1 transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Questions</span>
                </button>
              </div>

              {/* INNOVATIVE: 1-Tap Question Palette (Fast, Reliable, No Mic Glitches) */}
              {showQueryPalette && (
                <div className="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                      Tap any card for immediate analysis & audio:
                    </span>
                    <button onClick={() => setShowQueryPalette(false)} className="text-stone-400 hover:text-stone-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SMART_AGRO_QUERIES.map(q => (
                      <button
                        key={q.id}
                        onClick={() => handleSendAdvisor(q.question)}
                        className="p-2 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-left transition space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{q.icon}</span>
                          <span className="text-[8px] bg-stone-200 text-stone-600 font-bold px-1 rounded">
                            {q.tag}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-stone-800 leading-tight">
                          {q.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Horizontal Prompt Scroller */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {SMART_AGRO_QUERIES.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleSendAdvisor(q.question)}
                    className="bg-white border border-stone-200 hover:border-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-medium text-stone-700 whitespace-nowrap shadow-2xs transition flex items-center gap-1"
                  >
                    <span>{q.icon}</span>
                    <span>{q.title}</span>
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-3 min-h-[300px] flex flex-col justify-between">
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {advisorHistory.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-stone-900 text-white rounded-tr-none'
                          : 'bg-stone-100 text-stone-800 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.sender === 'ai' && (
                        <button 
                          onClick={() => speakText(msg.text, audioRate)}
                          className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-0.5 mt-0.5 px-1"
                        >
                          <Volume2 className="w-3 h-3" /> Read aloud
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input box with Smart Palette Button (No broken mic) */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5">
                  <button
                    onClick={() => setShowQueryPalette(!showQueryPalette)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                    title="Open Quick Questions Palette"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </button>
                  <input
                    type="text"
                    value={advisorInput}
                    onChange={(e) => setAdvisorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAdvisor()}
                    placeholder={t.askAiPlaceholder}
                    className="flex-1 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                  <button
                    onClick={() => handleSendAdvisor()}
                    disabled={!advisorInput.trim()}
                    className="p-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 5: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-3">
              
              <div>
                <h2 className="text-sm font-bold text-stone-900">{t.settingsTab}</h2>
                <p className="text-[10px] text-stone-500">Configure language, GPS location & parameters</p>
              </div>

              {/* Location Re-detect Card in Settings */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Farm Location via Google
                </span>
                <p className="text-[11px] text-stone-600">
                  {googleLocation ? googleLocation.formattedAddress : "No GPS location set yet."}
                </p>
                <button
                  onClick={requestFarmerLiveLocation}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Update GPS Location with Google</span>
                </button>
              </div>

              {/* Audio Dispatch Preferences */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-600" /> Daily Audio Bulletin Settings
                </span>
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <span>Voice Speed</span>
                  <div className="flex items-center gap-1">
                    {[1.0, 1.25, 1.5].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setAudioRate(rate)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          audioRate === rate ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language Card */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-stone-600" /> Select Language
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'हिन्दी' },
                    { code: 'te', name: 'తెలుగు' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code as any)}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition ${
                        lang === l.code 
                          ? 'bg-amber-400 border-amber-500 text-stone-950 font-bold' 
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Project ZIP Card */}
              <div className="bg-gradient-to-r from-emerald-950 to-stone-900 border border-emerald-800/60 p-3.5 rounded-2xl text-white space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Download Project (.ZIP)</h4>
                    <p className="text-[10px] text-stone-400">Run locally on your laptop with Node.js</p>
                  </div>
                </div>

                <a
                  href="/bolt-ai-project.zip"
                  download="bolt-ai-project.zip"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download bolt-ai-project.zip (62 KB)</span>
                </a>

                <div className="bg-stone-950/80 p-2 rounded-xl text-[10px] text-stone-300 font-mono space-y-1">
                  <p className="text-stone-400 font-sans text-[9px]">Terminal Commands:</p>
                  <p className="text-emerald-300">1. unzip bolt-ai-project.zip</p>
                  <p className="text-emerald-300">2. cd bolt-ai-project && npm install</p>
                  <p className="text-emerald-300">3. npm run dev</p>
                </div>
              </div>

              {/* Reset Data */}
              <button
                onClick={() => {
                  setMandiData(INITIAL_MANDI);
                  setTranslations(INITIAL_TRANSLATIONS);
                  setLocationStatus('unrequested');
                  setGoogleLocation(null);
                }}
                className="w-full py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Default</span>
              </button>

              {/* Team 11 Credit Tag */}
              <div className="text-center pt-2 pb-1 text-[10px] text-stone-400">
                <p>Designed & Developed with ❤️ by <strong className="text-stone-600 font-bold">team 11</strong></p>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION */}
        <nav className="bg-white border-t border-stone-200 px-2 py-2 flex items-center justify-around shrink-0 z-40">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'home' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t.homeTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'mandi' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t.mandiTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'weather' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t.weatherTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'advisor' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t.advisorTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'settings' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t.settingsTab}</span>
          </button>
        </nav>

        {/* MODAL: LOCATION SELECTOR & GOOGLE MAPS DETAILS */}
        {showLocationModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-end justify-center p-0">
            <div className="bg-white w-full rounded-t-3xl p-4 space-y-3.5 max-h-[90%] overflow-y-auto animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Farm Location (Google Maps)</h3>
                    <p className="text-[10px] text-stone-500">Live GPS & Geocoding</p>
                  </div>
                </div>
                <button onClick={() => setShowLocationModal(false)} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Button: Auto-Detect GPS */}
              <button
                onClick={requestFarmerLiveLocation}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>Detect Live GPS with Google</span>
              </button>

              {/* Current Detected Address */}
              {googleLocation && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Google Verified Address</span>
                  <p className="font-semibold text-stone-900">{googleLocation.formattedAddress}</p>
                  <p className="text-[10px] text-stone-500">
                    Coordinates: {googleLocation.latitude.toFixed(4)}° N, {googleLocation.longitude.toFixed(4)}° E
                  </p>
                </div>
              )}

              {/* Quick Preset Regions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Or Pick Agricultural Region
                </span>
                <div className="space-y-1">
                  {POPULAR_AGRI_REGIONS.map(reg => (
                    <button
                      key={reg.name}
                      onClick={() => selectPredefinedRegion(reg)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 text-left text-xs flex items-center justify-between transition"
                    >
                      <div>
                        <p className="font-bold text-stone-800">{reg.name.split(',')[0]}</p>
                        <p className="text-[10px] text-stone-500">{reg.name}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD MANDI RECORD */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-end justify-center p-0">
            <div className="bg-white w-full rounded-t-3xl p-4 space-y-3 max-h-[85%] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-stone-900">Add Mandi Rate Record</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMandi} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-stone-500">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groundnut"
                    value={newCropForm.crop}
                    onChange={(e) => setNewCropForm({ ...newCropForm, crop: e.target.value })}
                    className="w-full mt-0.5 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500">Category</label>
                    <select
                      value={newCropForm.category}
                      onChange={(e) => setNewCropForm({ ...newCropForm, category: e.target.value })}
                      className="w-full mt-0.5 border border-stone-200 px-2 py-1.5 rounded-lg text-stone-800 focus:outline-none"
                    >
                      <option value="Cereals">Cereals</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Spices">Spices</option>
                      <option value="Pulses">Pulses</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500">Mandi Market</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Warangal APMC"
                      value={newCropForm.market}
                      onChange={(e) => setNewCropForm({ ...newCropForm, market: e.target.value })}
                      className="w-full mt-0.5 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500">Price (₹ / Quintal)</label>
                  <input
                    type="number"
                    required
                    value={newCropForm.price}
                    onChange={(e) => setNewCropForm({ ...newCropForm, price: Number(e.target.value) })}
                    className="w-full mt-0.5 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-800 font-bold focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-stone-900 text-white font-semibold rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
