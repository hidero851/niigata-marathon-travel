import type { LocalProduct } from '../types';

const MOCK_SOURCE = {
  sourceName: '仮データ（手動作成）',
  sourceUrl: '#',
  sourceType: 'manual_created' as const,
  retrievedAt: '2024-01-01',
  termsChecked: true,
  usageAllowed: true,
  usageNote: '仮データ。実際の商品情報は各公式サイトでご確認ください。',
};

export const allProducts: LocalProduct[] = [
  {
    id: 'niigata-koshihikari',
    name: '新潟コシヒカリ',
    area: '新潟県全域',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #f9a825, #e65100)',
    shortDescription: '日本一と称される新潟産の最高級ブランド米',
    description:
      '新潟コシヒカリは豊富な雪解け水と肥沃な越後平野の大地が育む日本最高峰のブランド米です。粒が大きくもちもちした食感と甘い香りは、一度食べると忘れられない感動を与えます。大会完走後のおにぎりや新米ご飯は、格別の達成感と一緒に味わえます。',
    recommendedPoint:
      'レース後の身体に、新潟の新米おにぎりはまさに最高のご褒美。炊き立ての香りと甘みが疲れた身体に染み渡ります。',
    whereToBuy: '新潟市内スーパー・道の駅・JR新潟駅お土産売り場',
    externalUrl: '#',
    relatedEventIds: ['niigata-city-marathon', 'uonuma-koyo-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'nodoguro',
    name: 'のどぐろ（アカムツ）',
    area: '新潟市・糸魚川市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #e53935, #b71c1c)',
    shortDescription: '「白身のトロ」と呼ばれる幻の高級魚',
    description:
      'のどぐろは日本海でとれる高級魚で、その喉の内側が黒いことからその名がつきました。脂が豊富でとろけるような食感から「白身のトロ」とも呼ばれます。塩焼き・刺身・煮付けどれも絶品。新潟シティマラソン後の打ち上げには、新潟港の新鮮なのどぐろを味わってください。',
    recommendedPoint:
      '新潟産のどぐろの塩焼きは、レース後の最高のご褒美。日本海の旨みがぎっしり詰まった身は感動もの。',
    whereToBuy: '新潟市中央区・古町の料亭・寺泊の魚のアメ横',
    externalUrl: '#',
    relatedEventIds: ['niigata-city-marathon', 'sasagawa-nagare-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'kakinotane',
    name: '柿の種（新潟名物）',
    area: '長岡市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #ff7043, #bf360c)',
    shortDescription: '新潟・長岡生まれの定番スナック。醤油の本場ならではの深い味わい',
    description:
      '柿の種は新潟県長岡市浪花屋製菓が発祥の地。醤油ベースのピリ辛タレが絡んだ米菓はレースの補給食にもぴったり。新潟の醤油文化が生んだ深いコクは全国区の人気を誇ります。バリエーションも豊富で、辛さ違い・わさび味・チョコがけなど多彩。',
    recommendedPoint:
      '走りながらでも食べやすい小袋タイプはレースの行動食にも。お土産としては知名度抜群。',
    whereToBuy: 'JR新潟駅・道の駅・長岡市内土産店・全国コンビニ',
    externalUrl: '#',
    relatedEventIds: ['niigata-city-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'hakkaisan',
    name: '八海山（日本酒）',
    area: '南魚沼市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #1565c0, #0d47a1)',
    shortDescription: '越後の名峰・八海山の伏流水が育む全国屈指の銘酒',
    description:
      '八海山は新潟県南魚沼市の八海醸造が生み出す、清潔感と品格を備えた日本酒。霊峰・八海山の清らかな伏流水と越後杜氏の技が融合した辛口淡麗が特徴。普通酒から大吟醸まで幅広いラインナップがあり、「米どころ・酒どころ」新潟を代表する銘酒です。',
    recommendedPoint:
      '南魚沼グルメマラソンの後、旬のコシヒカリと合わせて飲む八海山は格別。地元蔵元の直売所では限定酒も。',
    whereToBuy: '八海醸造直売店（南魚沼市）・全国デパート・駅土産売り場',
    externalUrl: '#',
    relatedEventIds: ['minami-uonuma-gourmet', 'uonuma-koyo-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'sado-natural-buri',
    name: '佐渡天然ブリ',
    area: '佐渡市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #00838f, #006064)',
    shortDescription: '日本海の荒波で育った、脂のり抜群の天然ブリ',
    description:
      '佐渡沖の豊かな漁場で育った天然ブリは、身がしっかりしていて脂のりが良く、刺身はもちろん塩焼きや照り焼きも絶品。特に冬場の「寒ブリ」は脂が乗り最高の旬を迎えます。佐渡トキマラソンに参加した際は、ぜひ地元の漁師料理を味わってください。',
    recommendedPoint:
      '佐渡の民宿での夕食に出てくる天然ブリの刺身盛りは圧巻。マラソン後の疲れを吹き飛ばす旨さ。',
    whereToBuy: '両津港・佐渡の朝市・地元鮮魚店',
    externalUrl: '#',
    relatedEventIds: ['sado-toki-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'murakami-gyu',
    name: '村上牛',
    area: '村上市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #6a1b4d, #4a148c)',
    shortDescription: '新潟のブランド和牛。赤身の旨みと上品な霜降りが自慢',
    description:
      '村上牛は新潟県北部・村上市で育てられたブランド和牛。豊かな自然環境と良質な飼料で育ち、きめ細かな霜降りと深い旨みが特徴。ステーキ・すき焼き・しゃぶしゃぶどれも上品な味わいを楽しめます。笹川流れマラソン後の打ち上げ食事にぜひ。',
    recommendedPoint:
      'レース後の絶好のご褒美。村上市内の専門店では産地証明付きの村上牛を味わえます。',
    whereToBuy: '村上市内レストラン・精肉店・駅前土産物店',
    externalUrl: '#',
    relatedEventIds: ['sasagawa-nagare-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'sasa-dango',
    name: '笹団子',
    area: '新潟県全域',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
    shortDescription: '新潟を代表する郷土菓子。笹の香りとよもぎの風味が懐かしい味',
    description:
      'よもぎを練り込んだ団子にあんこを包み、笹の葉で巻いた新潟を代表する和菓子。笹の葉には殺菌効果があり、昔から保存食として重宝されてきました。独特の笹の香りとよもぎの風味、甘さ控えめのあんこが絶妙なハーモニー。',
    recommendedPoint:
      '走り終わった後の糖質補給に最適。新潟土産の定番中の定番で、喜ばれること間違いなし。',
    whereToBuy: 'JR新潟駅・道の駅・全域の菓子店',
    externalUrl: '#',
    relatedEventIds: ['niigata-city-marathon', 'gosen-koyo-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'hegi-soba',
    name: 'へぎそば',
    area: '魚沼市・十日町市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #5d4037, #3e2723)',
    shortDescription: '海藻「布海苔」でつないだ新潟独自の冷たいそば',
    description:
      'へぎそばは布海苔（ふのり）をつなぎに使った新潟独特のそば。「へぎ」と呼ばれる器に盛られた独特の食べ方が特徴で、コシが強くつるりとした食感と独特の粘り気が一度食べたらやみつきになる味わい。越後湯沢・十日町エリアで味わえる名物料理。',
    recommendedPoint:
      '南魚沼グルメマラソンのゴール後、地元の蕎麦屋でへぎそばを食べると達成感が倍増。',
    whereToBuy: '十日町市・魚沼市内の蕎麦専門店・越後湯沢駅周辺',
    externalUrl: '#',
    relatedEventIds: ['minami-uonuma-gourmet', 'uonuma-koyo-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'minami-uonuma-koshihikari',
    name: '南魚沼産コシヒカリ',
    area: '南魚沼市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #f57f17, #e65100)',
    shortDescription: '世界が認めた最高ブランド米。雪解け水と豊かな自然が育む極上の一粒',
    description:
      '南魚沼産コシヒカリは日本、いや世界最高峰のブランド米として名高い一品。越後三山の豊富な雪解け水と昼夜の寒暖差が米の旨みと甘さを最大限に引き出します。炊き立ての香りと輝くツヤ、もっちりとした食感は他のどの米とも比べられない感動を与えます。',
    recommendedPoint:
      '南魚沼グルメマラソンでは地元農家が炊いた南魚沼産コシヒカリのおにぎりがコースに出ます。これだけのためにレース参加する人も。',
    whereToBuy: '南魚沼市内農産物直売所・道の駅・全国デパートの新潟コーナー',
    externalUrl: '#',
    relatedEventIds: ['minami-uonuma-gourmet'],
    sourceInfo: [MOCK_SOURCE],
  },
  {
    id: 'momofukudou',
    name: 'キッテサブレ（百々福堂）',
    area: '上越市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #e91e63, #880e4f)',
    shortDescription: '郵便の父・前島密ゆかりの上越発、やさしい味わいの焼き菓子',
    description:
      '百々福堂（ももふくどう）は「お菓子で心を笑顔に」をコンセプトに、上越市本町で営む焼き菓子の店。看板商品のキッテサブレは、上越市出身で「郵便の父」と称される前島密にちなんだ一品。地元の素材を活かしたやさしい甘さのサブレで、上越ならではのお土産として人気を集めています。雪下にんじんミルクゼリーなど、新潟の特産を使ったスイーツも揃えています。',
    recommendedPoint:
      'レース後のご褒美や仲間へのお土産に最適。前島密という地元の偉人ストーリーと一緒に渡すと話題になること間違いなし。',
    whereToBuy: '新潟県上越市本町2丁目1-9（百々福堂）',
    salesLocations: ['百々福堂（上越市本町2丁目1-9）'],
    externalUrl: 'https://momofukudou.jp/',
    relatedEventIds: [],
    sourceInfo: [
      {
        sourceName: '百々福堂 公式サイト',
        sourceUrl: 'https://momofukudou.jp/',
        sourceType: 'manual_created',
        retrievedAt: '2026-05-15',
        termsChecked: true,
        usageAllowed: true,
        usageNote: '公式サイトの公開情報をもとに手動作成。',
      },
    ],
  },
  {
    id: 'sample-product',
    name: '【サンプル】越後高田の羊羹（大杉屋惣兵衛）',
    area: '上越市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #4a1a1a, #8b3a3a)',
    shortDescription: '創業1592年・越後高田の老舗。上杉謙信公の書から名を取った黒羊羹「第一義」など、全国五つ星の手みやげ',
    description:
      '大杉屋惣兵衛は文禄元年（1592年）創業の越後高田を代表する老舗和菓子店。看板商品の黒羊羹「第一義」は、上杉謙信公の書からその名をとり、北海道産小豆と沖縄・波照間産の黒砂糖にこだわった濃厚な一品。小倉羊羹「春日山」は北海道産大納言小豆を自家炊きし、甘みを抑えた上品な味わい。どちらも最高級の寒天を使用し、60年以上にわたって愛される銘菓として『全国五つ星の手みやげ』にも選ばれています。',
    recommendedPoint:
      '上越エリアのマラソン参加者へのお土産に最適。400年以上続く越後の歴史と上杉謙信公ゆかりのストーリーが詰まった一本は、渡した相手の記憶に残ります。',
    whereToBuy: '本店（上越市本町5-3-31）またはお馬出し店（上越市本町3丁目）で購入できます。',
    salesLocations: [
      '本店：新潟県上越市本町5丁目3-31（9:00〜17:00・木曜定休）',
      'お馬出し店：上越市本町3丁目（10:00〜18:00・水曜定休）',
    ],
    externalUrl: 'https://ohsugiya.com/',
    relatedEventIds: [],
    sourceInfo: [
      {
        sourceName: '大杉屋惣兵衛 公式サイト',
        sourceUrl: 'https://ohsugiya.com/',
        sourceType: 'manual_created',
        retrievedAt: '2026-05-15',
        termsChecked: true,
        usageAllowed: true,
        usageNote: 'サンプルページ用コピー。',
      },
    ],
  },
  {
    id: 'ohsugiya-yokan',
    name: '越後高田の羊羹（大杉屋惣兵衛）',
    area: '上越市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #4a1a1a, #8b3a3a)',
    shortDescription: '創業1592年・越後高田の老舗。上杉謙信公の書から名を取った黒羊羹「第一義」など、全国五つ星の手みやげ',
    description:
      '大杉屋惣兵衛は文禄元年（1592年）創業の越後高田を代表する老舗和菓子店。看板商品の黒羊羹「第一義」は、上杉謙信公の書からその名をとり、北海道産小豆と沖縄・波照間産の黒砂糖にこだわった濃厚な一品。小倉羊羹「春日山」は北海道産大納言小豆を自家炊きし、甘みを抑えた上品な味わい。どちらも最高級の寒天を使用し、60年以上にわたって愛される銘菓として『全国五つ星の手みやげ』にも選ばれています。',
    recommendedPoint:
      '上越エリアのマラソン参加者へのお土産に最適。400年以上続く越後の歴史と上杉謙信公ゆかりのストーリーが詰まった一本は、渡した相手の記憶に残ります。',
    whereToBuy: '本店（上越市本町5-3-31）またはお馬出し店（上越市本町3丁目）で購入できます。',
    salesLocations: [
      '本店：新潟県上越市本町5丁目3-31（9:00〜17:00・木曜定休）',
      'お馬出し店：上越市本町3丁目（10:00〜18:00・水曜定休）',
    ],
    externalUrl: 'https://ohsugiya.com/',
    relatedEventIds: [],
    sourceInfo: [
      {
        sourceName: '大杉屋惣兵衛 公式サイト',
        sourceUrl: 'https://ohsugiya.com/',
        sourceType: 'manual_created',
        retrievedAt: '2026-05-15',
        termsChecked: true,
        usageAllowed: true,
        usageNote: '公式サイトの公開情報をもとに手動作成。',
      },
    ],
  },
  {
    id: 'kanzuri',
    name: 'かんずり（寒造里）',
    area: '妙高市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #b71c1c, #e65100)',
    shortDescription: '雪さらし・3年熟成の発酵辛味調味料。妙高が育てた唐辛子と糀と柚子の逸品',
    description:
      '有限会社かんずりが守り続ける「かんずり（寒造里）」は、新潟県妙高市に400年以上伝わる発酵辛味調味料。地元産唐辛子を大寒（1月20日前後）に雪の上にさらす「雪さらし」で塩分・アクを抜き、旨みを引き出したのち、米糀・柚子・海の塩と合わせて最低3年間じっくり熟成・発酵させます。辛さの中に発酵ならではの酸味と旨み、柚子の爽やかな香りが重なる特徴的な味わいです。6年熟成の「吟醸かんずり六年仕込」はさらに穏やかで深みのある風味に仕上がります。鍋の薬味はもちろん、豚汁・焼き鳥・ラーメン・パスタなど和洋中幅広い料理に活躍します。',
    recommendedPoint:
      '上越・妙高エリアのレース後、地元の郷土料理や鍋に添えたかんずりは格別。辛味調味料とは思えない発酵の奥深さで、一度使うと手放せなくなります。お土産としても知名度が高く、お酒好きにも料理好きにも喜ばれます。',
    whereToBuy: '有限会社かんずり直売所（妙高市大字猿橋）・妙高市内の道の駅・オンラインショップ',
    salesLocations: [
      '有限会社かんずり（新潟県妙高市大字猿橋758-1）',
      'オンラインショップ（kanzuri.shop-pro.jp）',
    ],
    externalUrl: 'https://kanzuri.com/',
    relatedEventIds: ['sea-to-summit-itoigawa-2026', 'joetsu-myoko-express-trail'],
    sourceInfo: [
      {
        sourceName: '有限会社かんずり 公式サイト',
        sourceUrl: 'https://kanzuri.com/',
        sourceType: 'official_event',
        retrievedAt: '2026-05-25',
        termsChecked: true,
        usageAllowed: true,
        usageNote: '公式サイト・農林水産省郷土料理ページをもとに手動作成。',
      },
    ],
  },
  {
    id: 'kotake-sandopan',
    name: '小竹製菓のサンドパン',
    area: '上越市',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #c8860a, #e8a820)',
    shortDescription: '大正13年創業、上越のソウルフード',
    description:
      '100年以上変わらない製法と味。クリームは一つひとつ手作業で塗り、作り置き一切なしの作りたて主義。半世紀変わらないパッケージも上越市民に愛され続けている老舗の証。',
    recommendedPoint:
      '上越妙高駅や新潟駅などの駅でも購入可能。旅のお供や大会前後のエネルギー補給にもぴったりの上越土産。',
    whereToBuy: '上越妙高駅・新潟駅・湯沢駅・東京駅・上野駅ほか',
    salesLocations: ['上越妙高駅', '新潟駅', '湯沢駅', '東京駅', '上野駅'],
    externalUrl: 'https://kotakeseika.com/',
    relatedEventIds: [],
    sourceInfo: [
      {
        sourceName: '小竹製菓公式サイト',
        sourceUrl: 'https://kotakeseika.com/',
        sourceType: 'manual_created' as const,
        retrievedAt: '2026-06-03',
        termsChecked: true,
        usageAllowed: true,
        usageNote: '公式サイトの公開情報をもとに手動作成。',
      },
    ],
  },
  {
    id: 'machida-shoyu',
    name: '町田醤油味噌醸造場（越後高田旨口醤油）',
    area: '上越市高田',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #5c2a0a, #9c4a1a)',
    shortDescription: '明治8年創業、高田城下町に蔵を構える老舗の地醤油',
    description:
      '新潟県上越市高田の城下町で明治8年から醤油を醸し続ける老舗蔵元。「越後高田旨口醤油」は煮物・刺身・卵かけご飯まで幅広く使える地元定番の旨口醤油。仕込みから一貫生産にこだわり、添加物不使用の本醸造醤油は大豆本来の旨みとすっきりした風味が特徴。高田の街なかに実店舗を構え、醤油のほか越後味噌・甘酒・しょうゆの実（あじもろみ）・かぐらなんばん辛味噌など上越の発酵食品を幅広く製造・販売している。',
    recommendedPoint:
      '高田城址公園のすぐそばに蔵を構える地元の醤油屋さん。大会帰りに立ち寄って、上越ならではの旨口醤油をお土産に。',
    whereToBuy: '公式サイト通販・上越市内直売所（上越市東本町3-2-24）',
    salesLocations: ['公式サイト通販', '上越市東本町（直売所）'],
    externalUrl: 'https://www.machida-shouyumiso.co.jp/',
    relatedEventIds: [
      'echigo-kenshin-kikizake-marathon',
      'takada-castle-road-race',
      'joetsu-myoko-express-trail',
    ],
    sourceInfo: [
      {
        sourceName: '町田醤油味噌醸造場公式サイト',
        sourceUrl: 'https://www.machida-shouyumiso.co.jp/',
        sourceType: 'manual_created' as const,
        retrievedAt: '2026-06-03',
        termsChecked: true,
        usageAllowed: true,
        usageNote: '公式サイトの公開情報をもとに手動作成。',
      },
    ],
  },
  {
    id: 'iwa-kaki',
    name: '岩牡蠣（笹川流れ）',
    area: '村上市・笹川流れ',
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #00695c, #004d40)',
    shortDescription: '日本海の荒波が育てた巨大な天然岩牡蠣。夏の風物詩',
    description:
      '笹川流れの岩牡蠣は6〜8月が旬の夏の味覚。日本海の海水と山から流れ込む栄養豊富な川水が交わる豊かな漁場で育ち、大きいもので直径15cm以上になります。乳白色のぷりぷりとした身と濃厚なクリーミーな旨みは他の牡蠣では味わえない感動。',
    recommendedPoint:
      '笹川流れマラソンは6月開催。ゴール後の岩牡蠣の旬が始まる時期に重なります。旬の岩牡蠣をレモンで食べる夏の絶品体験。',
    whereToBuy: '笹川流れ沿いの海産物直売所・村上市内の鮮魚店・道の駅 笹川流れ',
    externalUrl: '#',
    relatedEventIds: ['sasagawa-nagare-marathon'],
    sourceInfo: [MOCK_SOURCE],
  },
];
