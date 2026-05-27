// ─── Types ────────────────────────────────────────────────────────────────────

export type Para = {
  id: number;
  nameArabic: string;
  nameBengali: string;
  pageStart: number;
  pageEnd: number;
};

export type Surah = {
  id: number;
  nameArabic: string;
  nameBengali: string;
  paraId: number;
  pageStart: number;
  pageEnd: number;
  ayahCount: number;
};

export type Page = {
  id: number;
  paraId: number;
  surahId: number;
  firstWord: string; // প্রথম শব্দ — পরে তুমি manually fill করবে
  firstAyahNum: number;
};

export type PageRecord = {
  pageId: number;
  strength: 0 | 1 | 2 | 3 | 4 | 5;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  lastReviewed: string;
  nextReview: string;
};

export type SajdahAyah = {
  num: number;
  surahId: number;
  surahName: string;
  ayahNum: number;
  paraId: number;
};

// ─── Paras (30) ──────────────────────────────────────────────────────────────
// Emdadia 15-line, 611 pages edition
export const PARAS: Para[] = [
  { id: 1,  nameArabic: "الٓمٓ",         nameBengali: "আলিফ-লাম-মিম",      pageStart: 1,   pageEnd: 21  },
  { id: 2,  nameArabic: "سَيَقُولُ",     nameBengali: "সাইয়াকুল",           pageStart: 22,  pageEnd: 41  },
  { id: 3,  nameArabic: "تِلۡكَ",        nameBengali: "তিলকার",              pageStart: 42,  pageEnd: 62  },
  { id: 4,  nameArabic: "لَن تَنَالُواْ", nameBengali: "লান তানালু",         pageStart: 63,  pageEnd: 81  },
  { id: 5,  nameArabic: "وَٱلۡمُحۡصَنَٰتُ", nameBengali: "ওয়াল মুহসানাত",  pageStart: 82,  pageEnd: 101 },
  { id: 6,  nameArabic: "لَا يُحِبُّ",   nameBengali: "লা ইউহিব্বু",         pageStart: 102, pageEnd: 121 },
  { id: 7,  nameArabic: "وَإِذَا",       nameBengali: "ওয়া ইযা",            pageStart: 122, pageEnd: 141 },
  { id: 8,  nameArabic: "وَلَوۡ أَنَّنَا", nameBengali: "ওয়ালাউ আন্নানা",  pageStart: 142, pageEnd: 161 },
  { id: 9,  nameArabic: "قَالَ ٱلۡمَلَأُ", nameBengali: "কালাল মালাউ",     pageStart: 162, pageEnd: 181 },
  { id: 10, nameArabic: "وَٱعۡلَمُوٓاْ", nameBengali: "ওয়া-লামু",           pageStart: 182, pageEnd: 201 },
  { id: 11, nameArabic: "يَعۡتَذِرُونَ", nameBengali: "ইয়া-তাযিরুন",        pageStart: 202, pageEnd: 221 },
  { id: 12, nameArabic: "وَمَا مِن دَآبَّةٍ", nameBengali: "ওয়া মা মিন",  pageStart: 222, pageEnd: 241 },
  { id: 13, nameArabic: "وَمَآ أُبَرِّئُ", nameBengali: "ওয়া মা উবাররিউ", pageStart: 242, pageEnd: 261 },
  { id: 14, nameArabic: "رُبَمَا",       nameBengali: "রুবামা",               pageStart: 262, pageEnd: 281 },
  { id: 15, nameArabic: "سُبۡحَٰنَ",    nameBengali: "সুবহানাল্লাযি",        pageStart: 282, pageEnd: 301 },
  { id: 16, nameArabic: "قَالَ أَلَمۡ", nameBengali: "কালা আলাম",            pageStart: 302, pageEnd: 321 },
  { id: 17, nameArabic: "ٱقۡتَرَبَ",    nameBengali: "ইক্বতারাবা",           pageStart: 322, pageEnd: 341 },
  { id: 18, nameArabic: "قَدۡ أَفۡلَحَ", nameBengali: "কাদ আফলাহা",         pageStart: 342, pageEnd: 361 },
  { id: 19, nameArabic: "وَقَالَ",      nameBengali: "ওয়া কালাল্লাযিন",     pageStart: 362, pageEnd: 381 },
  { id: 20, nameArabic: "أَمَّنۡ",      nameBengali: "আম্মান খালাকা",         pageStart: 382, pageEnd: 401 },
  { id: 21, nameArabic: "ٱتۡلُ",        nameBengali: "উতলু",                  pageStart: 402, pageEnd: 421 },
  { id: 22, nameArabic: "وَمَن يَقۡنُتۡ", nameBengali: "ওয়া মাই ইয়াকনুত", pageStart: 422, pageEnd: 441 },
  { id: 23, nameArabic: "وَمَآ أُنزِلَ", nameBengali: "ওয়া মা উনযিলা",     pageStart: 442, pageEnd: 461 },
  { id: 24, nameArabic: "فَمَن أَظۡلَمُ", nameBengali: "ফামান আজলাম",       pageStart: 462, pageEnd: 481 },
  { id: 25, nameArabic: "إِلَيۡهِ يُرَدُّ", nameBengali: "ইলাইহি ইউরাদ্দু", pageStart: 482, pageEnd: 501 },
  { id: 26, nameArabic: "حٰمٓ",          nameBengali: "হা-মিম",               pageStart: 502, pageEnd: 521 },
  { id: 27, nameArabic: "قَالَ فَمَا",  nameBengali: "কালা ফামা",            pageStart: 522, pageEnd: 541 },
  { id: 28, nameArabic: "قَدۡ سَمِعَ",  nameBengali: "কাদ সামিআ",            pageStart: 542, pageEnd: 561 },
  { id: 29, nameArabic: "تَبَٰرَكَ",    nameBengali: "তাবারাকা",              pageStart: 562, pageEnd: 581 },
  { id: 30, nameArabic: "عَمَّ",        nameBengali: "আম্মা",                 pageStart: 582, pageEnd: 611 },
];

// ─── Surahs (114) — key structural data ──────────────────────────────────────
export const SURAHS: Surah[] = [
  { id: 1,   nameArabic: "الفاتحة",       nameBengali: "আল-ফাতিহা",      paraId: 1,  pageStart: 1,   pageEnd: 1,   ayahCount: 7   },
  { id: 2,   nameArabic: "البقرة",        nameBengali: "আল-বাকারা",      paraId: 1,  pageStart: 2,   pageEnd: 49,  ayahCount: 286 },
  { id: 3,   nameArabic: "آل عمران",      nameBengali: "আলে-ইমরান",      paraId: 3,  pageStart: 50,  pageEnd: 76,  ayahCount: 200 },
  { id: 4,   nameArabic: "النساء",        nameBengali: "আন-নিসা",        paraId: 4,  pageStart: 77,  pageEnd: 106, ayahCount: 176 },
  { id: 5,   nameArabic: "المائدة",       nameBengali: "আল-মায়িদা",     paraId: 6,  pageStart: 106, pageEnd: 127, ayahCount: 120 },
  { id: 6,   nameArabic: "الأنعام",       nameBengali: "আল-আনআম",        paraId: 7,  pageStart: 128, pageEnd: 150, ayahCount: 165 },
  { id: 7,   nameArabic: "الأعراف",       nameBengali: "আল-আ'রাফ",       paraId: 8,  pageStart: 151, pageEnd: 176, ayahCount: 206 },
  { id: 8,   nameArabic: "الأنفال",       nameBengali: "আল-আনফাল",       paraId: 9,  pageStart: 177, pageEnd: 186, ayahCount: 75  },
  { id: 9,   nameArabic: "التوبة",        nameBengali: "আত-তাওবা",       paraId: 10, pageStart: 187, pageEnd: 207, ayahCount: 129 },
  { id: 10,  nameArabic: "يونس",          nameBengali: "ইউনুস",           paraId: 11, pageStart: 208, pageEnd: 221, ayahCount: 109 },
  { id: 11,  nameArabic: "هود",           nameBengali: "হুদ",             paraId: 11, pageStart: 221, pageEnd: 235, ayahCount: 123 },
  { id: 12,  nameArabic: "يوسف",          nameBengali: "ইউসুফ",           paraId: 12, pageStart: 235, pageEnd: 248, ayahCount: 111 },
  { id: 13,  nameArabic: "الرعد",         nameBengali: "আর-রা'দ",         paraId: 13, pageStart: 249, pageEnd: 255, ayahCount: 43  },
  { id: 14,  nameArabic: "إبراهيم",       nameBengali: "ইবরাহিম",         paraId: 13, pageStart: 255, pageEnd: 261, ayahCount: 52  },
  { id: 15,  nameArabic: "الحجر",         nameBengali: "আল-হিজর",         paraId: 14, pageStart: 262, pageEnd: 267, ayahCount: 99  },
  { id: 16,  nameArabic: "النحل",         nameBengali: "আন-নাহল",         paraId: 14, pageStart: 267, pageEnd: 281, ayahCount: 128 },
  { id: 17,  nameArabic: "الإسراء",       nameBengali: "আল-ইসরা",         paraId: 15, pageStart: 282, pageEnd: 293, ayahCount: 111 },
  { id: 18,  nameArabic: "الكهف",         nameBengali: "আল-কাহফ",         paraId: 15, pageStart: 293, pageEnd: 304, ayahCount: 110 },
  { id: 19,  nameArabic: "مريم",          nameBengali: "মারইয়াম",         paraId: 16, pageStart: 305, pageEnd: 312, ayahCount: 98  },
  { id: 20,  nameArabic: "طه",            nameBengali: "ত্বা-হা",          paraId: 16, pageStart: 312, pageEnd: 321, ayahCount: 135 },
  { id: 21,  nameArabic: "الأنبياء",      nameBengali: "আল-আম্বিয়া",     paraId: 17, pageStart: 322, pageEnd: 331, ayahCount: 112 },
  { id: 22,  nameArabic: "الحج",          nameBengali: "আল-হাজ্জ",        paraId: 17, pageStart: 332, pageEnd: 341, ayahCount: 78  },
  { id: 23,  nameArabic: "المؤمنون",      nameBengali: "আল-মুমিনুন",      paraId: 18, pageStart: 342, pageEnd: 349, ayahCount: 118 },
  { id: 24,  nameArabic: "النور",         nameBengali: "আন-নূর",          paraId: 18, pageStart: 350, pageEnd: 359, ayahCount: 64  },
  { id: 25,  nameArabic: "الفرقان",       nameBengali: "আল-ফুরকান",       paraId: 18, pageStart: 359, pageEnd: 366, ayahCount: 77  },
  { id: 26,  nameArabic: "الشعراء",       nameBengali: "আশ-শুআরা",        paraId: 19, pageStart: 367, pageEnd: 376, ayahCount: 227 },
  { id: 27,  nameArabic: "النمل",         nameBengali: "আন-নামল",         paraId: 19, pageStart: 377, pageEnd: 385, ayahCount: 93  },
  { id: 28,  nameArabic: "القصص",         nameBengali: "আল-কাসাস",        paraId: 20, pageStart: 385, pageEnd: 396, ayahCount: 88  },
  { id: 29,  nameArabic: "العنكبوت",      nameBengali: "আল-আনকাবুত",      paraId: 20, pageStart: 396, pageEnd: 404, ayahCount: 69  },
  { id: 30,  nameArabic: "الروم",         nameBengali: "আর-রুম",          paraId: 21, pageStart: 404, pageEnd: 410, ayahCount: 60  },
  { id: 31,  nameArabic: "لقمان",         nameBengali: "লুকমান",           paraId: 21, pageStart: 411, pageEnd: 414, ayahCount: 34  },
  { id: 32,  nameArabic: "السجدة",        nameBengali: "আস-সাজদাহ",       paraId: 21, pageStart: 415, pageEnd: 417, ayahCount: 30  },
  { id: 33,  nameArabic: "الأحزاب",      nameBengali: "আল-আহযাব",        paraId: 21, pageStart: 418, pageEnd: 427, ayahCount: 73  },
  { id: 34,  nameArabic: "سبإ",           nameBengali: "সাবা",             paraId: 22, pageStart: 428, pageEnd: 434, ayahCount: 54  },
  { id: 35,  nameArabic: "فاطر",          nameBengali: "ফাতির",            paraId: 22, pageStart: 434, pageEnd: 440, ayahCount: 45  },
  { id: 36,  nameArabic: "يس",            nameBengali: "ইয়া-সিন",         paraId: 22, pageStart: 440, pageEnd: 445, ayahCount: 83  },
  { id: 37,  nameArabic: "الصافات",       nameBengali: "আস-সাফফাত",       paraId: 23, pageStart: 446, pageEnd: 452, ayahCount: 182 },
  { id: 38,  nameArabic: "ص",             nameBengali: "সোয়াদ",           paraId: 23, pageStart: 453, pageEnd: 458, ayahCount: 88  },
  { id: 39,  nameArabic: "الزمر",         nameBengali: "আয-যুমার",         paraId: 23, pageStart: 458, pageEnd: 467, ayahCount: 75  },
  { id: 40,  nameArabic: "غافر",          nameBengali: "গাফির",            paraId: 24, pageStart: 467, pageEnd: 476, ayahCount: 85  },
  { id: 41,  nameArabic: "فصلت",          nameBengali: "ফুস্সিলাত",        paraId: 24, pageStart: 477, pageEnd: 482, ayahCount: 54  },
  { id: 42,  nameArabic: "الشورى",        nameBengali: "আশ-শুরা",          paraId: 25, pageStart: 483, pageEnd: 489, ayahCount: 53  },
  { id: 43,  nameArabic: "الزخرف",        nameBengali: "আয-যুখরুফ",        paraId: 25, pageStart: 489, pageEnd: 495, ayahCount: 89  },
  { id: 44,  nameArabic: "الدخان",        nameBengali: "আদ-দুখান",         paraId: 25, pageStart: 496, pageEnd: 498, ayahCount: 59  },
  { id: 45,  nameArabic: "الجاثية",       nameBengali: "আল-জাসিয়া",       paraId: 25, pageStart: 499, pageEnd: 502, ayahCount: 37  },
  { id: 46,  nameArabic: "الأحقاف",       nameBengali: "আল-আহকাফ",        paraId: 26, pageStart: 502, pageEnd: 507, ayahCount: 35  },
  { id: 47,  nameArabic: "محمد",          nameBengali: "মুহাম্মাদ",        paraId: 26, pageStart: 507, pageEnd: 511, ayahCount: 38  },
  { id: 48,  nameArabic: "الفتح",         nameBengali: "আল-ফাতহ",         paraId: 26, pageStart: 511, pageEnd: 515, ayahCount: 29  },
  { id: 49,  nameArabic: "الحجرات",       nameBengali: "আল-হুজুরাত",      paraId: 26, pageStart: 515, pageEnd: 517, ayahCount: 18  },
  { id: 50,  nameArabic: "ق",             nameBengali: "কাফ",              paraId: 26, pageStart: 518, pageEnd: 520, ayahCount: 45  },
  { id: 51,  nameArabic: "الذاريات",      nameBengali: "আয-যারিয়াত",      paraId: 26, pageStart: 520, pageEnd: 523, ayahCount: 60  },
  { id: 52,  nameArabic: "الطور",         nameBengali: "আত-তুর",          paraId: 27, pageStart: 523, pageEnd: 525, ayahCount: 49  },
  { id: 53,  nameArabic: "النجم",         nameBengali: "আন-নাজম",         paraId: 27, pageStart: 526, pageEnd: 528, ayahCount: 62  },
  { id: 54,  nameArabic: "القمر",         nameBengali: "আল-কামার",        paraId: 27, pageStart: 528, pageEnd: 531, ayahCount: 55  },
  { id: 55,  nameArabic: "الرحمن",        nameBengali: "আর-রাহমান",       paraId: 27, pageStart: 531, pageEnd: 534, ayahCount: 78  },
  { id: 56,  nameArabic: "الواقعة",       nameBengali: "আল-ওয়াকিআ",      paraId: 27, pageStart: 534, pageEnd: 537, ayahCount: 96  },
  { id: 57,  nameArabic: "الحديد",        nameBengali: "আল-হাদিদ",        paraId: 27, pageStart: 537, pageEnd: 541, ayahCount: 29  },
  { id: 58,  nameArabic: "المجادلة",      nameBengali: "আল-মুজাদালা",     paraId: 28, pageStart: 542, pageEnd: 545, ayahCount: 22  },
  { id: 59,  nameArabic: "الحشر",         nameBengali: "আল-হাশর",         paraId: 28, pageStart: 545, pageEnd: 549, ayahCount: 24  },
  { id: 60,  nameArabic: "الممتحنة",      nameBengali: "আল-মুমতাহিনা",    paraId: 28, pageStart: 549, pageEnd: 551, ayahCount: 13  },
  { id: 61,  nameArabic: "الصف",          nameBengali: "আস-সাফ",          paraId: 28, pageStart: 551, pageEnd: 552, ayahCount: 14  },
  { id: 62,  nameArabic: "الجمعة",        nameBengali: "আল-জুমুআ",        paraId: 28, pageStart: 553, pageEnd: 554, ayahCount: 11  },
  { id: 63,  nameArabic: "المنافقون",     nameBengali: "আল-মুনাফিকুন",    paraId: 28, pageStart: 554, pageEnd: 555, ayahCount: 11  },
  { id: 64,  nameArabic: "التغابن",       nameBengali: "আত-তাগাবুন",      paraId: 28, pageStart: 556, pageEnd: 557, ayahCount: 18  },
  { id: 65,  nameArabic: "الطلاق",        nameBengali: "আত-তালাক",        paraId: 28, pageStart: 558, pageEnd: 559, ayahCount: 12  },
  { id: 66,  nameArabic: "التحريم",       nameBengali: "আত-তাহরিম",       paraId: 28, pageStart: 560, pageEnd: 561, ayahCount: 12  },
  { id: 67,  nameArabic: "الملك",         nameBengali: "আল-মুলক",         paraId: 29, pageStart: 562, pageEnd: 564, ayahCount: 30  },
  { id: 68,  nameArabic: "القلم",         nameBengali: "আল-কালাম",        paraId: 29, pageStart: 564, pageEnd: 566, ayahCount: 52  },
  { id: 69,  nameArabic: "الحاقة",        nameBengali: "আল-হাক্কা",       paraId: 29, pageStart: 566, pageEnd: 568, ayahCount: 52  },
  { id: 70,  nameArabic: "المعارج",       nameBengali: "আল-মাআরিজ",       paraId: 29, pageStart: 568, pageEnd: 570, ayahCount: 44  },
  { id: 71,  nameArabic: "نوح",           nameBengali: "নূহ",              paraId: 29, pageStart: 570, pageEnd: 571, ayahCount: 28  },
  { id: 72,  nameArabic: "الجن",          nameBengali: "আল-জিন",          paraId: 29, pageStart: 572, pageEnd: 573, ayahCount: 28  },
  { id: 73,  nameArabic: "المزمل",        nameBengali: "আল-মুযযাম্মিল",   paraId: 29, pageStart: 574, pageEnd: 575, ayahCount: 20  },
  { id: 74,  nameArabic: "المدثر",        nameBengali: "আল-মুদ্দাস্সির",  paraId: 29, pageStart: 575, pageEnd: 577, ayahCount: 56  },
  { id: 75,  nameArabic: "القيامة",       nameBengali: "আল-কিয়ামা",      paraId: 29, pageStart: 577, pageEnd: 578, ayahCount: 40  },
  { id: 76,  nameArabic: "الإنسان",       nameBengali: "আল-ইনসান",        paraId: 29, pageStart: 578, pageEnd: 580, ayahCount: 31  },
  { id: 77,  nameArabic: "المرسلات",      nameBengali: "আল-মুরসালাত",     paraId: 29, pageStart: 580, pageEnd: 581, ayahCount: 50  },
  { id: 78,  nameArabic: "النبإ",         nameBengali: "আন-নাবা",         paraId: 30, pageStart: 582, pageEnd: 583, ayahCount: 40  },
  { id: 79,  nameArabic: "النازعات",      nameBengali: "আন-নাযিআত",       paraId: 30, pageStart: 583, pageEnd: 584, ayahCount: 46  },
  { id: 80,  nameArabic: "عبس",           nameBengali: "আবাসা",            paraId: 30, pageStart: 585, pageEnd: 585, ayahCount: 42  },
  { id: 81,  nameArabic: "التكوير",       nameBengali: "আত-তাকউইর",       paraId: 30, pageStart: 586, pageEnd: 586, ayahCount: 29  },
  { id: 82,  nameArabic: "الانفطار",      nameBengali: "আল-ইনফিতার",      paraId: 30, pageStart: 587, pageEnd: 587, ayahCount: 19  },
  { id: 83,  nameArabic: "المطففين",      nameBengali: "আল-মুতাফফিফিন",   paraId: 30, pageStart: 587, pageEnd: 589, ayahCount: 36  },
  { id: 84,  nameArabic: "الانشقاق",      nameBengali: "আল-ইনশিকাক",      paraId: 30, pageStart: 589, pageEnd: 589, ayahCount: 25  },
  { id: 85,  nameArabic: "البروج",        nameBengali: "আল-বুরুজ",        paraId: 30, pageStart: 590, pageEnd: 590, ayahCount: 22  },
  { id: 86,  nameArabic: "الطارق",        nameBengali: "আত-তারিক",        paraId: 30, pageStart: 591, pageEnd: 591, ayahCount: 17  },
  { id: 87,  nameArabic: "الأعلى",        nameBengali: "আল-আ'লা",         paraId: 30, pageStart: 591, pageEnd: 592, ayahCount: 19  },
  { id: 88,  nameArabic: "الغاشية",       nameBengali: "আল-গাশিয়া",      paraId: 30, pageStart: 592, pageEnd: 592, ayahCount: 26  },
  { id: 89,  nameArabic: "الفجر",         nameBengali: "আল-ফজর",          paraId: 30, pageStart: 593, pageEnd: 594, ayahCount: 30  },
  { id: 90,  nameArabic: "البلد",         nameBengali: "আল-বালাদ",        paraId: 30, pageStart: 594, pageEnd: 594, ayahCount: 20  },
  { id: 91,  nameArabic: "الشمس",         nameBengali: "আশ-শামস",         paraId: 30, pageStart: 595, pageEnd: 595, ayahCount: 15  },
  { id: 92,  nameArabic: "الليل",         nameBengali: "আল-লাইল",         paraId: 30, pageStart: 595, pageEnd: 596, ayahCount: 21  },
  { id: 93,  nameArabic: "الضحى",         nameBengali: "আদ-দুহা",         paraId: 30, pageStart: 596, pageEnd: 596, ayahCount: 11  },
  { id: 94,  nameArabic: "الشرح",         nameBengali: "আল-ইনশিরাহ",      paraId: 30, pageStart: 596, pageEnd: 596, ayahCount: 8   },
  { id: 95,  nameArabic: "التين",         nameBengali: "আত-তিন",          paraId: 30, pageStart: 597, pageEnd: 597, ayahCount: 8   },
  { id: 96,  nameArabic: "العلق",         nameBengali: "আল-আলাক",         paraId: 30, pageStart: 597, pageEnd: 598, ayahCount: 19  },
  { id: 97,  nameArabic: "القدر",         nameBengali: "আল-কাদর",         paraId: 30, pageStart: 598, pageEnd: 598, ayahCount: 5   },
  { id: 98,  nameArabic: "البينة",        nameBengali: "আল-বায়্যিনা",     paraId: 30, pageStart: 598, pageEnd: 599, ayahCount: 8   },
  { id: 99,  nameArabic: "الزلزلة",       nameBengali: "আয-যালযালা",      paraId: 30, pageStart: 599, pageEnd: 599, ayahCount: 8   },
  { id: 100, nameArabic: "العاديات",      nameBengali: "আল-আদিয়াত",      paraId: 30, pageStart: 599, pageEnd: 600, ayahCount: 11  },
  { id: 101, nameArabic: "القارعة",       nameBengali: "আল-কারিআ",        paraId: 30, pageStart: 600, pageEnd: 600, ayahCount: 11  },
  { id: 102, nameArabic: "التكاثر",       nameBengali: "আত-তাকাসুর",      paraId: 30, pageStart: 600, pageEnd: 601, ayahCount: 8   },
  { id: 103, nameArabic: "العصر",         nameBengali: "আল-আসর",          paraId: 30, pageStart: 601, pageEnd: 601, ayahCount: 3   },
  { id: 104, nameArabic: "الهمزة",        nameBengali: "আল-হুমাযা",       paraId: 30, pageStart: 601, pageEnd: 601, ayahCount: 9   },
  { id: 105, nameArabic: "الفيل",         nameBengali: "আল-ফিল",          paraId: 30, pageStart: 601, pageEnd: 602, ayahCount: 5   },
  { id: 106, nameArabic: "قريش",          nameBengali: "কুরাইশ",           paraId: 30, pageStart: 602, pageEnd: 602, ayahCount: 4   },
  { id: 107, nameArabic: "الماعون",       nameBengali: "আল-মাউন",         paraId: 30, pageStart: 602, pageEnd: 602, ayahCount: 7   },
  { id: 108, nameArabic: "الكوثر",        nameBengali: "আল-কাউসার",       paraId: 30, pageStart: 602, pageEnd: 602, ayahCount: 3   },
  { id: 109, nameArabic: "الكافرون",      nameBengali: "আল-কাফিরুন",      paraId: 30, pageStart: 603, pageEnd: 603, ayahCount: 6   },
  { id: 110, nameArabic: "النصر",         nameBengali: "আন-নাসর",         paraId: 30, pageStart: 603, pageEnd: 603, ayahCount: 3   },
  { id: 111, nameArabic: "المسد",         nameBengali: "আল-মাসাদ",        paraId: 30, pageStart: 603, pageEnd: 603, ayahCount: 5   },
  { id: 112, nameArabic: "الإخلاص",       nameBengali: "আল-ইখলাস",        paraId: 30, pageStart: 604, pageEnd: 604, ayahCount: 4   },
  { id: 113, nameArabic: "الفلق",         nameBengali: "আল-ফালাক",        paraId: 30, pageStart: 604, pageEnd: 604, ayahCount: 5   },
  { id: 114, nameArabic: "الناس",         nameBengali: "আন-নাস",          paraId: 30, pageStart: 604, pageEnd: 604, ayahCount: 6   },
];

// ─── Pages (611) — generated with placeholder firstWord ──────────────────────
// তুমি পরে firstWord গুলো manually fill করবে অথবা script দিয়ে করবে

function buildPageData(): Page[] {
  const pages: Page[] = [];
  for (let i = 1; i <= 611; i++) {
    // Find which para this page belongs to
    const para = PARAS.find(p => i >= p.pageStart && i <= p.pageEnd) ?? PARAS[0];
    // Find which surah starts on or before this page within this para
    const surahsInPara = SURAHS.filter(s => s.paraId === para.id);
    const surah = [...surahsInPara].reverse().find(s => s.pageStart <= i) ?? surahsInPara[0];
    pages.push({
      id: i,
      paraId: para.id,
      surahId: surah?.id ?? 1,
      firstWord: "[ প্রথম শব্দ ]", // Manual fill needed
      firstAyahNum: 1,
    });
  }
  return pages;
}

export const PAGES: Page[] = buildPageData();

// ─── Sajdah Ayahs (14) ───────────────────────────────────────────────────────
export const SAJDAHS: SajdahAyah[] = [
  { num: 1,  surahId: 7,  surahName: "আল-আ'রাফ",    ayahNum: 206, paraId: 9  },
  { num: 2,  surahId: 13, surahName: "আর-রা'দ",      ayahNum: 15,  paraId: 13 },
  { num: 3,  surahId: 16, surahName: "আন-নাহল",      ayahNum: 49,  paraId: 14 },
  { num: 4,  surahId: 17, surahName: "আল-ইসরা",      ayahNum: 107, paraId: 15 },
  { num: 5,  surahId: 19, surahName: "মারইয়াম",      ayahNum: 58,  paraId: 16 },
  { num: 6,  surahId: 22, surahName: "আল-হাজ্জ",     ayahNum: 18,  paraId: 17 },
  { num: 7,  surahId: 22, surahName: "আল-হাজ্জ",     ayahNum: 77,  paraId: 17 },
  { num: 8,  surahId: 25, surahName: "আল-ফুরকান",    ayahNum: 60,  paraId: 18 },
  { num: 9,  surahId: 27, surahName: "আন-নামল",      ayahNum: 26,  paraId: 19 },
  { num: 10, surahId: 32, surahName: "আস-সাজদাহ",    ayahNum: 15,  paraId: 21 },
  { num: 11, surahId: 38, surahName: "সোয়াদ",        ayahNum: 24,  paraId: 23 },
  { num: 12, surahId: 41, surahName: "ফুস্সিলাত",    ayahNum: 37,  paraId: 24 },
  { num: 13, surahId: 53, surahName: "আন-নাজম",      ayahNum: 62,  paraId: 27 },
  { num: 14, surahId: 96, surahName: "আল-আলাক",      ayahNum: 19,  paraId: 30 },
];

// ─── Lookup Functions ─────────────────────────────────────────────────────────

export function getPage(id: number): Page | undefined {
  return PAGES[id - 1];
}

export function getSurah(id: number): Surah | undefined {
  return SURAHS.find(s => s.id === id);
}

export function getPara(id: number): Para | undefined {
  return PARAS.find(p => p.id === id);
}

export function getParaPages(paraId: number): Page[] {
  return PAGES.filter(p => p.paraId === paraId);
}

export function getParaSurahs(paraId: number): Surah[] {
  return SURAHS.filter(s => s.paraId === paraId);
}

export function getPageSurah(pageId: number): Surah | undefined {
  const page = getPage(pageId);
  if (!page) return undefined;
  return getSurah(page.surahId);
}

export function getPagePara(pageId: number): Para | undefined {
  const page = getPage(pageId);
  if (!page) return undefined;
  return getPara(page.paraId);
}

// ─── Page Records ─────────────────────────────────────────────────────────────

export function createDefaultPageRecords(): PageRecord[] {
  return Array.from({ length: 611 }, (_, i) => ({
    pageId: i + 1,
    strength: 0,
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
    lastReviewed: "",
    nextReview: "",
  }));
}

export function createMockPageRecords(): PageRecord[] {
  const today = new Date().toISOString().slice(0, 10);
  return Array.from({ length: 611 }, (_, i) => {
    const pageId = i + 1;
    // Para 30 = mostly strong, Para 27 = weak, rest varied
    const paraId = getPage(pageId)?.paraId ?? 1;
    const baseStrength = paraId === 30 ? 4 : paraId === 27 ? 1 : Math.floor(Math.random() * 5);
    const strength = Math.min(5, Math.max(0, baseStrength)) as 0|1|2|3|4|5;
    return {
      pageId,
      strength,
      interval: strength * 3 + 1,
      easeFactor: 2.5,
      reviewCount: strength > 0 ? Math.floor(Math.random() * 10) + 1 : 0,
      lastReviewed: strength > 0 ? today : "",
      nextReview: strength > 0 ? today : "",
    };
  });
}

export function getParaStrength(records: PageRecord[], paraId: number): number {
  const paraPages = getParaPages(paraId);
  if (!paraPages.length) return 0;
  const reviewed = records.filter(r => paraPages.some(p => p.id === r.pageId));
  if (!reviewed.length) return 0;
  const avg = reviewed.reduce((s, r) => s + r.strength, 0) / reviewed.length;
  return Math.round((avg / 5) * 100);
}
