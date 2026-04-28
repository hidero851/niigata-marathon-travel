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
