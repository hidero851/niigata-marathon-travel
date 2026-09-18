/** 自サイトに掲載ページがない外部大会（カレンダー表示のみ） */
export type ExternalEvent = {
  id: string;
  name: string;
  eventDate: string;
  eventDateEnd?: string;
  location: string;
  distances: string[];
  officialUrl: string;
  type: 'road' | 'trail' | 'ultra';
};

export const externalEvents: ExternalEvent[] = [

  // ── 2026年1月 ──
  {
    id: 'ext-murakami-gantan-2026',
    name: '第71回村上市元旦マラソン',
    eventDate: '2026-01-01',
    location: '村上市',
    distances: ['10km', '3km', '1km'],
    officialUrl: 'https://www.murakami-gantan.com/',
    type: 'road',
  },
  {
    id: 'ext-sanjo-gantan-2026',
    name: '第21回三条市元旦マラソン',
    eventDate: '2026-01-01',
    location: '三条市（三条東公園）',
    distances: ['10km', '5km', '3km', '1km'],
    officialUrl: 'https://www.city.sanjo.niigata.jp/',
    type: 'road',
  },

  // ── 2026年2月 ──
  {
    id: 'ext-snow-trail-runners-cup-2026',
    name: 'スノートレイルランナーズカップ越後丘陵公園2026',
    eventDate: '2026-02-08',
    location: '長岡市（国営越後丘陵公園）',
    distances: ['8km', '4km'],
    officialUrl: 'https://echigo-park.jp/',
    type: 'trail',
  },

  // ── 2026年3月 ──
  {
    id: 'ext-matsudai-fuyunojin-2026',
    name: '第36回越後まつだい冬の陣',
    eventDate: '2026-03-07',
    eventDateEnd: '2026-03-08',
    location: '十日町市松代（松代スキー場）',
    distances: ['スノーシュー各種'],
    officialUrl: 'https://fuyunojin.matsudai.jp/',
    type: 'trail',
  },
  {
    id: 'ext-niigata-half-marathon-2026',
    name: '新潟ハーフマラソン2026',
    eventDate: '2026-03-15',
    location: '新潟市（デンカビッグスワンスタジアム）',
    distances: ['ハーフ'],
    officialUrl: 'https://n-halfmarathon.jp/',
    type: 'road',
  },

  // ── 2026年4月 ──
  {
    id: 'ext-kakudayama-half-2026',
    name: '第11回角田山一周ハーフマラソン',
    eventDate: '2026-04-05',
    location: '新潟市西蒲区（角田山）',
    distances: ['ハーフ', '10km', '5km'],
    officialUrl: 'https://nishikan-sports.com/kakudahm/',
    type: 'road',
  },
  {
    id: 'ext-tsubame-sakura-marathon-2026',
    name: '第37回燕さくらマラソン',
    eventDate: '2026-04-11',
    location: '燕市（大河津分水路）',
    distances: ['10km', '5km', '3km', '1km'],
    officialUrl: 'https://www.tsubame-sakura-marathon.com/',
    type: 'road',
  },
  {
    id: 'ext-sasagawa-nagare-marathon-2026',
    name: '笹川流れマラソン2026',
    eventDate: '2026-04-12',
    location: '村上市（桑川弁天島）',
    distances: ['フル', 'ハーフ', '10km', '5km'],
    officialUrl: 'https://www.city.murakami.lg.jp/',
    type: 'road',
  },
  {
    id: 'ext-awashima-eco-marathon-2026',
    name: '第12回粟島一周エコマラソン',
    eventDate: '2026-04-19',
    location: '粟島浦村（粟島）',
    distances: ['23km'],
    officialUrl: 'https://eco-journey.org/',
    type: 'road',
  },
  {
    id: 'ext-yoneyama-sanroku-2026',
    name: '第34回米山山麓ロードレース',
    eventDate: '2026-04-19',
    location: '上越市柿崎区（かきざきドーム）',
    distances: ['ハーフ', '10km', '5km', '3km'],
    officialUrl: 'https://www.s-nets.info/yoneyama-sanroku/',
    type: 'road',
  },
  {
    id: 'ext-mitsuke-kariyata-half-2026',
    name: '第12回見附刈谷田川ハーフマラソン',
    eventDate: '2026-04-20',
    location: '見附市（見附運動公園）',
    distances: ['ハーフ', '5km', '3km'],
    officialUrl: 'https://mitsuke-sports.com/mitsuke-marathon/',
    type: 'road',
  },
  {
    id: 'ext-sado-toki-marathon-2026',
    name: '佐渡トキマラソン2026',
    eventDate: '2026-04-26',
    location: '佐渡市（おんでこドーム）',
    distances: ['フル42.195km'],
    officialUrl: 'https://www.scsf.jp/marathon/',
    type: 'road',
  },

  // ── 2026年5月 ──
  {
    id: 'ext-kashiwazaki-shiokaze-2026',
    name: '第26回柏崎潮風マラソン',
    eventDate: '2026-05-17',
    location: '柏崎市',
    distances: ['フル', 'ハーフ', '10km'],
    officialUrl: 'https://shiokaze-run.info/',
    type: 'road',
  },

  // ── 2026年6月 ──
  {
    id: 'ext-takada-castle-road-race-2026',
    name: '第27回高田城ロードレース',
    eventDate: '2026-06-07',
    location: '上越市（高田城址公園）',
    distances: ['ハーフ', '10km', '5km', '3km'],
    officialUrl: 'https://run.niigata-map.jp/races/takada-castle-road-race/2026-27th/',
    type: 'road',
  },
  {
    id: 'ext-minamiuonuma-gourmet-marathon-2026',
    name: '南魚沼グルメマラソン2026',
    eventDate: '2026-06-15',
    location: '南魚沼市',
    distances: ['フル', 'ハーフ', '10km'],
    officialUrl: 'https://gurumara.com/',
    type: 'road',
  },

  // ── 2026年7月 ──
  {
    id: 'ext-trail-runners-cup-niigata-2026',
    name: 'トレイルランナーズカップ新潟2026',
    eventDate: '2026-07-26',
    location: '新潟県',
    distances: ['トレイルラン'],
    officialUrl: 'https://trailrunners.jp/event/niigata-2026/',
    type: 'trail',
  },

  // ── 2026年9月 ──
  {
    id: 'ext-naeba-cc-half-2026',
    name: '苗場クロスカントリーハーフマラソン2026',
    eventDate: '2026-09-13',
    location: '湯沢町（苗場スキー場周辺）',
    distances: ['ハーフ'],
    officialUrl: 'https://niigata-kankou.or.jp/',
    type: 'road',
  },
  {
    id: 'ext-shinetsu-gogaku-2026',
    name: '信越五岳トレイルランニングレース2026',
    eventDate: '2026-09-21',
    eventDateEnd: '2026-09-23',
    location: '妙高市・信濃町・飯山市ほか',
    distances: ['100mile', '110km'],
    officialUrl: 'https://sfmt100.com/',
    type: 'ultra',
  },
  {
    id: 'ext-sado-eco-journey-2026',
    name: '佐渡島一周エコ・ジャーニーウルトラ遠足208km',
    eventDate: '2026-09-25',
    eventDateEnd: '2026-09-27',
    location: '佐渡市（両津港スタート）',
    distances: ['208km'],
    officialUrl: 'https://eco-journey.org/',
    type: 'ultra',
  },

  // ── 2026年10月 ──
  {
    id: 'ext-niigata-relay-marathon-2026',
    name: '第10回42.195km新潟リレーマラソン',
    eventDate: '2026-10-18',
    location: '新潟市北区（島見緑地）',
    distances: ['フルリレー'],
    officialUrl: 'https://shimami-seiro.com/',
    type: 'road',
  },

  // ── 2027年1月 ──
  {
    id: 'ext-murakami-gantan-2027',
    name: '第72回村上市元旦マラソン',
    eventDate: '2027-01-01',
    location: '村上市',
    distances: ['10km', '3km', '1km'],
    officialUrl: 'https://www.murakami-gantan.com/',
    type: 'road',
  },

  // ── 2027年2月 ──
  {
    id: 'ext-hakkaisan-sky-snow-2027',
    name: '八海山スカイスノー2027',
    eventDate: '2027-02-27',
    location: '南魚沼市（六日町八海山スキー場）',
    distances: ['バーティカル', '4km', '2km'],
    officialUrl: 'https://hakkaisan.run/',
    type: 'trail',
  },

  // ── 2027年3月 ──
  {
    id: 'ext-matsudai-fuyunojin-2027',
    name: '第37回越後まつだい冬の陣',
    eventDate: '2027-03-01',
    location: '十日町市松代（松代スキー場）',
    distances: ['スノーシュー各種'],
    officialUrl: 'https://fuyunojin.matsudai.jp/',
    type: 'trail',
  },
];
