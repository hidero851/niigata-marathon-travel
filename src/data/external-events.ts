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
  {
    id: 'ext-niigata-half-marathon-2026',
    name: '新潟ハーフマラソン2026',
    eventDate: '2026-03-15',
    location: '新潟市（デンカビッグスワンスタジアム）',
    distances: ['ハーフ'],
    officialUrl: 'https://n-halfmarathon.jp/',
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
  {
    id: 'ext-kashiwazaki-shiokaze-2026',
    name: '第26回柏崎潮風マラソン',
    eventDate: '2026-05-17',
    location: '柏崎市',
    distances: ['フル', 'ハーフ', '10km'],
    officialUrl: 'https://shiokaze-run.info/',
    type: 'road',
  },
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
  {
    id: 'ext-trail-runners-cup-niigata-2026',
    name: 'トレイルランナーズカップ新潟2026',
    eventDate: '2026-07-26',
    location: '新潟県',
    distances: ['トレイルラン'],
    officialUrl: 'https://trailrunners.jp/event/niigata-2026/',
    type: 'trail',
  },
];
