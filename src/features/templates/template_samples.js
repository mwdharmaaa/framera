/**
 * Preset sample reference imagery and metadata defaults for curated studio templates.
 * All presets draw authentic photography footage exclusively from the user-provided pool in assets/user_provided/.
 */
const U = {
  p0: 'assets/user_provided/1790039442490_0_scaled_1000000128.jpg',
  p1: 'assets/user_provided/1790039442536_1_scaled_1000000129.jpg',
  p2: 'assets/user_provided/1790039442582_2_scaled_1000000126.jpg',
  p3: 'assets/user_provided/1790039442623_3_scaled_1000000127.jpg',
  p4: 'assets/user_provided/1790039442665_4_scaled_1000000117.jpg',
  p5: 'assets/user_provided/1790039442708_5_scaled_1000000118.jpg',
  p6: 'assets/user_provided/1790039442751_6_scaled_1000000119.jpg',
  p7: 'assets/user_provided/1790039442794_7_scaled_1000000120.jpg',
  p8: 'assets/user_provided/1790039442837_8_scaled_1000000121.jpg',
  p9: 'assets/user_provided/1790039442880_9_scaled_1000000122.jpg',
  p10: 'assets/user_provided/1790039442924_10_scaled_1000000124.jpg',
  p11: 'assets/user_provided/1790039442967_11_scaled_1000000123.jpg',
  p12: 'assets/user_provided/1790039443011_12_scaled_1000000125.jpg',
  p13: 'assets/user_provided/1790039443054_13_scaled_1000000116.jpg'
};

export const TEMPLATE_SAMPLES = {
  focus_editorial: {
    src: U.p0,
    caption: 'FOCUS',
    subtitle: 'In a world obsessed with attention, focus becomes rare. It is not loud, dramatic, or rushed: it moves quietly, shaping dreams in silence while the distracted never notice.',
    date: '2026 - VOL.02'
  },
  wincore: {
    src: U.p1,
    caption: 'Warning',
    subtitle: 'Your existence will now be erased.',
    date: "Finally I'll be free"
  },
  cinema_poster: {
    src: U.p2,
    caption: 'HELLO',
    subtitle: 'Open your eyes and look the vibes of your world. Just focus on your self',
    date: '17 AGUSTUS 2025'
  },
  astral_koi: {
    src: U.p3,
    caption: 'ASTRAL REVERIE',
    subtitle: 'Deep within the quiet waters of consciousness, dreams navigate through astral light.',
    date: 'VOL. 03 - DREAM REVERIE'
  },
  tokyo_brutalist: {
    src: U.p4,
    caption: 'TOKYO',
    subtitle: 'Avant-garde Japanese graphic poster with architectural red grid and brutalist banner',
    date: '2026 - ARCHIVE VOL.01'
  },
  instagram95: {
    src: U.p5,
    caption: 'Instagram.exe - [Photo Filter Studio]',
    subtitle: 'Retro Windows 95 application window with vintage scanlines',
    date: '1995-10-24 16:42:00'
  },
  ai_vision: {
    src: U.p6,
    caption: 'TARGET ACQUIRED',
    subtitle: 'MODEL: YOLO-VISION-NEURAL-X',
    date: 'LAT: 35.6762 // LNG: 139.6503'
  },
  fisheye: {
    src: U.p7,
    caption: 'CURVATURE REALITY',
    subtitle: 'SPHERICAL PERSPECTIVE DISTORTION',
    date: 'ISO 400 // 1/250s // MULTI-COATED'
  },
  comic_portal: {
    src: U.p8,
    caption: 'EYES OF THE BEHOLDER',
    subtitle: 'HAND-CRAFTED COMIC SKETCH EDITION',
    date: 'SIGNATURE #042 // 2026'
  },
  folded_poster: {
    src: U.p9,
    caption: 'FAST',
    subtitle: 'LIVE\nLAUGH\nCRASH OUT',
    date: '12/12/2025'
  },
  future_awaits: {
    src: U.p10,
    caption: 'FUTURE',
    subtitle: 'Awaits',
    date: '2026 // VOL.01'
  },
  eyes_trend: {
    src: U.p11,
    caption: 'EYES TREND',
    subtitle: 'VIRAL DOODLE EDITION',
    date: '2026 // VOL.01'
  },
  final_girl: {
    src: U.p12,
    caption: 'godhood is like girlhood',
    subtitle: 'begging to be believed',
    date: 'FINAL GIRL STUDIOS'
  },
  vinyl_trio: {
    src: U.p0,
    photos: [U.p0, U.p1, U.p2],
    caption: 'STEREO SIDE A',
    subtitle: '33 RPM // VOL. 03',
    date: 'MEMORIES // 2026'
  },
  cyan_motion: {
    src: U.p13,
    caption: 'CYAN ECHO',
    subtitle: 'DIRECTIONAL VELOCITY',
    date: '1/500s // ISO 800 // F/1.4'
  },
  inverted_duet: {
    src: U.p3,
    photos: [U.p3, U.p4],
    caption: 'PARALLEL',
    subtitle: 'These videos heal something in me',
    date: '2026 // VOL.02'
  },
  analog_tide: {
    src: U.p0,
    caption: 'ANALOG TIDE',
    subtitle: 'SURGE OF SOLITUDE',
    date: '35MM // ARCHIVE 2026'
  },
  ocean_vinyl_trio: {
    src: U.p5,
    photos: [U.p5, U.p6, U.p7],
    caption: 'AQUA GROOVE',
    subtitle: 'TURNTABLE // VOL. 04',
    date: '33 RPM // ARCHIVE 2026'
  },
  locker_playlist_trio: {
    src: U.p8,
    photos: [U.p8, U.p9, U.p10],
    caption: 'seasons',
    subtitle: 'wave to earth',
    date: '1:56 // -2:20'
  },
  impasto_oil_atelier: {
    src: U.p11,
    caption: '',
    subtitle: '',
    date: ''
  },
  ocean_stories_quad: {
    src: U.p0,
    photos: [U.p0, U.p1, U.p2, U.p3],
    caption: '',
    subtitle: '',
    date: ''
  },
  life_offline_trio: {
    src: U.p4,
    photos: [U.p4, U.p5, U.p6],
    caption: '',
    subtitle: '',
    date: ''
  },
  golden_hour_hana: {
    src: U.p7,
    photos: [U.p7, U.p8, U.p9, U.p10],
    caption: 'Hana',
    subtitle: 'Fujii Kaze',
    date: '00:23 / 02:39'
  },
  memory_tree_deca: {
    src: U.p0,
    photos: [U.p0, U.p1, U.p2, U.p3, U.p4, U.p5, U.p6, U.p7, U.p8, U.p9],
    caption: 'Vyborg Trip',
    subtitle: 'Sonya Story',
    date: 'ARCHIVE // 2026'
  },
  ios_photosheet: {
    src: U.p12,
    caption: '1 Photo Selected',
    subtitle: 'Location Is Included',
    date: 'Options >'
  },
  trip_to_hill: {
    src: U.p11,
    photos: [U.p11, U.p12, U.p13],
    caption: 'Trip To Hill',
    subtitle: 'Story behind',
    date: 'at Bukit Cita - Cita'
  },
  meadow_patch_trio: {
    src: U.p1,
    photos: [U.p1, U.p3, U.p5],
    caption: 'REALLY REALLY PRETTY',
    subtitle: 'BLONDE GIRLS',
    date: 'framera.studio'
  },
  imessage_cascade: {
    src: U.p0,
    photos: [U.p0, U.p2, U.p4],
    caption: 'Text Message',
    subtitle: 'Delivered',
    date: 'iMessage'
  },
  whatsapp_chat_trio: {
    src: U.p6,
    photos: [U.p6, U.p8, U.p10],
    caption: 'Message yourself',
    subtitle: 'Type a message',
    date: '1:57 AM'
  },
  ambient_duo_card: {
    src: U.p7,
    photos: [U.p7, U.p9],
    caption: 'Spotify',
    subtitle: 'Ambient Beats',
    date: 'NOW PLAYING'
  },
  photobooth_strip: {
    src: U.p0,
    photos: [U.p0, U.p2, U.p4, U.p6, U.p8],
    caption: 'PHOTOBOOTH',
    subtitle: 'STUDIO ARCHIVE',
    date: 'NO. 0824 // 2026'
  },
  life_memories_quad: {
    src: U.p1,
    photos: [U.p1, U.p3, U.p5, U.p7],
    caption: 'LIFE',
    subtitle: 'Is A Collection Of Memories!',
    date: '2026 // MEMORIES'
  },
  ios_share_story: {
    src: U.p0,
    photos: [U.p0, U.p1, U.p2, U.p3, U.p4, U.p5],
    caption: '3 Photos Selected',
    subtitle: 'Location Included',
    date: 'Options >'
  },
  kraken_eyes: {
    src: U.p6,
    caption: 'KRAKEN // EYE SLIT',
    subtitle: '深淵の眼光 - ABYSSAL GAZE',
    date: 'NOIR // 2026'
  },
  bnw_duo_prints: {
    src: U.p11,
    photos: [U.p11, U.p12],
    caption: 'ANALOG DUO PRINTS',
    subtitle: 'ILFORD HP5 PLUS // FRAME 24-25',
    date: '35MM B&W // SILVER GELATIN'
  },
  bloom_alone: {
    src: U.p3,
    caption: 'ITS OKAY\nTO BLOOM\nALONE',
    subtitle: 'HOPE GANG',
    date: 'RESTRICTED // 2026'
  },
  jura_mountains_diary: {
    src: U.p0,
    photos: [U.p0, U.p1, U.p2, U.p3, U.p4, U.p5, U.p6, U.p7, U.p8],
    caption: 'jura mountains diary',
    subtitle: '',
    date: ''
  },
  midnight_formula: {
    src: U.p2,
    photos: [U.p2, U.p3, U.p8, U.p12],
    caption: 'formula',
    subtitle: 'labyrinth',
    date: '0:56 // -2:48'
  },
  the_sentimental: {
    src: U.p0,
    photos: [U.p0, U.p1],
    caption: 'the "sentimental"',
    subtitle: '...... trying very best version of me',
    date: ''
  },
  leopard_duo: {
    src: U.p3,
    photos: [U.p3, U.p4],
    caption: 'LEOPARD DUO',
    subtitle: 'CHIC EDITORIAL',
    date: 'EST. 2026'
  },
  seaside_diptych: {
    src: U.p8,
    photos: [
      U.p8,
      U.p9
    ],
    caption: 'SEASIDE DIPTYCH',
    subtitle: 'COASTAL SPLIT',
    date: 'EST. 2026'
  },
  silver_gelatin_duo: {
    src: U.p4,
    photos: [
      U.p4,
      U.p8
    ],
    caption: 'SILVER GELATIN',
    subtitle: 'ANALOG DUO',
    date: '35MM B&W'
  },
  metropolis_story: {
    src: U.p8,
    photos: [
      U.p8,
      U.p4
    ],
    caption: 'METROPOLIS',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Every street tells a story.',
    date: 'MADRID // 2026'
  },
  binder_clip_duo: {
    src: U.p0,
    photos: [
      U.p0,
      U.p4
    ],
    caption: 'Life is made up of small joys: nice food,',
    subtitle: 'gentle breeze, lazy afternoons and peaceful nights.',
    date: 'JOURNAL // 2026'
  },
  japan_travel_diary: {
    src: U.p0,
    photos: [
      U.p0, U.p1, U.p2,
      U.p3, U.p4, U.p5,
      U.p6, U.p7, U.p8,
      U.p9, U.p10, U.p11
    ],
    caption: 'JAPAN TRAVEL DIARY',
    subtitle: 'ヒッチハイクー！ // ぼちぼち帰ろっか // see you !',
    date: '35MM FILM // 2026'
  }
};
