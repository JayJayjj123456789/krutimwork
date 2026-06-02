const WMO_DESCRIPTIONS: Record<number, { th: string; en: string; icon: string; gradient: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm' }> = {
  0:  { th: 'ท้องฟ้าแจ่มใส',    en: 'Clear sky',         icon: 'clear_day',         gradient: 'sunny'   },
  1:  { th: 'เมฆเล็กน้อย',     en: 'Mainly clear',     icon: 'partly_cloudy_day', gradient: 'sunny'   },
  2:  { th: 'มีเมฆเป็นบางส่วน', en: 'Partly cloudy',    icon: 'partly_cloudy_day', gradient: 'cloudy'  },
  3:  { th: 'เมฆครึ้ม',         en: 'Overcast',         icon: 'cloudy',            gradient: 'cloudy'  },
  45: { th: 'หมอก',           en: 'Fog',              icon: 'foggy',             gradient: 'cloudy'  },
  48: { th: 'หมอกน้ำแข็ง',     en: 'Depositing rime fog', icon: 'foggy',         gradient: 'cloudy'  },
  51: { th: 'ฝนปรอยเล็กน้อย',  en: 'Light drizzle',    icon: 'rainy',             gradient: 'rain'    },
  53: { th: 'ฝนปรอย',          en: 'Moderate drizzle', icon: 'rainy',             gradient: 'rain'    },
  55: { th: 'ฝนปรอยหนัก',      en: 'Dense drizzle',    icon: 'rainy',             gradient: 'rain'    },
  61: { th: 'ฝนตกเล็กน้อย',    en: 'Slight rain',      icon: 'rainy',             gradient: 'rain'    },
  63: { th: 'ฝนตกปานกลาง',     en: 'Moderate rain',    icon: 'rainy',             gradient: 'rain'    },
  65: { th: 'ฝนตกหนัก',        en: 'Heavy rain',       icon: 'rainy',             gradient: 'rain'    },
  71: { th: 'หิมะตกเล็กน้อย',   en: 'Slight snow',      icon: 'ac_unit',           gradient: 'snow'    },
  73: { th: 'หิมะตกปานกลาง',   en: 'Moderate snow',    icon: 'ac_unit',           gradient: 'snow'    },
  75: { th: 'หิมะตกหนัก',       en: 'Heavy snow',       icon: 'ac_unit',           gradient: 'snow'    },
  80: { th: 'ฝนซู่เล็กน้อย',    en: 'Slight rain showers', icon: 'rainy',           gradient: 'rain'    },
  81: { th: 'ฝนซู่ปานกลาง',     en: 'Moderate rain showers', icon: 'rainy',         gradient: 'rain'    },
  82: { th: 'ฝนซู่รุนแรง',      en: 'Violent rain showers', icon: 'thunderstorm',  gradient: 'storm'   },
  95: { th: 'พายุฝนฟ้าคะนอง',  en: 'Thunderstorm',     icon: 'thunderstorm',      gradient: 'storm'   },
  96: { th: 'พายุฝนฟ้าคะนอง',  en: 'Thunderstorm with hail', icon: 'thunderstorm', gradient: 'storm' },
  99: { th: 'พายุฝนฟ้าคะนองรุนแรง', en: 'Severe thunderstorm', icon: 'thunderstorm', gradient: 'storm' },
};

export interface WmoInfo {
  code: number;
  th: string;
  en: string;
  icon: string;
  gradient: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm';
}

export function getWmoInfo(code: number | null | undefined): WmoInfo {
  if (code === null || code === undefined) {
    return { code: -1, th: 'ไม่ทราบ', en: 'Unknown', icon: 'help', gradient: 'cloudy' };
  }
  const info = WMO_DESCRIPTIONS[code];
  if (!info) {
    return { code, th: 'ไม่ทราบ', en: 'Unknown', icon: 'help', gradient: 'cloudy' };
  }
  return { code, ...info };
}
