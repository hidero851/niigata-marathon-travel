// 魚沼紅葉マラソン 特産品・施設の productVisualSettings を Supabase に登録するスクリプト
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zvezrxnusznsqksffkis.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZXpyeG51c3puc3Frc2Zma2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA1MTExNiwiZXhwIjoyMDkzNjI3MTE2fQ.9zMfmY5eWXmwTC3k65RWDT61ZE-lV19ThEbs8gIsQRg'
);

const products = [
  {
    productId: 'uonuma-jozo-amazake',
    imageUrl: '', imageAlt: '魚沼産コシヒカリ使用糀甘酒（魚沼醸造）',
    shortDescription: '砂糖不使用、米本来の甘みを楽しめる',
    description: '魚沼産コシヒカリ100％をつかった糀甘酒。自然な甘みで魚沼産コシヒカリのおいしさを引き立てた飲みやすい糀甘酒に仕上げました。アルコール0％、砂糖を使っていない糀甘酒です。',
    externalUrl: 'https://www.uonuma-jozo.co.jp/index.html',
    salesLocations: ['魚沼醸造オンラインショップ', '魚沼醸造糀サロン（発酵カフェ）', '新潟県内の道の駅'],
    whereToBuy: '魚沼醸造オンラインショップ・糀サロン・新潟県内の道の駅',
    shopMessage: '当店では米糀をつくる工程などの工場見学も受け付けております。魚沼にお越しの際はぜひお立ち寄りください。',
    isPublished: false,
  },
  {
    productId: 'hontaka-kintsubo',
    imageUrl: '', imageAlt: 'うす皮魚沼きんつば（にいがた本高砂屋）',
    shortDescription: '魚沼産よもぎを使った風味豊かな逸品',
    description: '天然の魚沼産よもぎを使用したよもぎのきんつばです。摘み取ったよもぎを家伝のきんつば餡と生地に加え薄く焼き上げました。よもぎの風味とほのかな香りがたまらない美味しいきんつばです。魚沼土産におすすめの逸品です。',
    externalUrl: 'https://niigata-hontaka.com/',
    salesLocations: ['にいがた本高砂屋本店', '原信小出東店', '道の駅深雪の里', 'まちの駅魚沼'],
    whereToBuy: 'にいがた本高砂屋本店・原信小出東店・道の駅など',
    shopMessage: 'レース後の自分へのご褒美に当店のおいしいお菓子はいかがでしょうか。餡のやさしい甘さは疲れた体にぴったりです。ぜひお立ち寄りください。店員一同お待ちしております。',
    isPublished: false,
  },
  {
    productId: 'marumiya-baumkuchen',
    imageUrl: '', imageAlt: 'バウムクーヘン魚沼の木コシヒカリ（お菓子工房まるみや）',
    shortDescription: '米粉ならではのやさしい口あたり',
    description: '魚沼産コシヒカリの米粉を使用して焼き上げた米粉のバウムクーヘンです。自社工房で専属パティシエが素材にこだわり一層一層丁寧に焼き上げています。ランナーの皆さまはもちろん、ご家族や応援の皆さまのお土産にもおすすめです。',
    externalUrl: 'https://www.marumiya-net.com/',
    salesLocations: ['お菓子工房まるみや', 'バウムクーヘン魚沼の木小出店', 'ウオロク小出店', 'まちの駅魚沼', 'お菓子工房まるみやオンラインショップ'],
    whereToBuy: 'お菓子工房まるみや・バウムクーヘン魚沼の木小出店・まちの駅魚沼など',
    shopMessage: 'ランナーの皆さまはもちろん、ご家族や応援の皆さまへのお土産にもおすすめです。会場での販売も予定しています！魚沼ならではの美味しさをぜひお楽しみください。',
    isPublished: false,
  },
  {
    productId: 'kogen-kirizai',
    imageUrl: '', imageAlt: '魚沼の切り菜（きりざい）（幸源）',
    shortDescription: 'ご飯や納豆によく合う郷土の味',
    description: '野沢菜漬を細かく刻んで野菜と合わせた魚沼地域の郷土食。八海山水系の伏流水と煮干醤油が味の決め手。納豆と和えて食べるのが「きりざい丼」としておすすめです。まずはそのまま、野菜と煮干しだしの旨みを味わってみてください。',
    externalUrl: 'https://uonuma-kougen.com/',
    salesLocations: ['幸源', 'うおぬま百菜花ん', 'サカキヤ', 'ウオロク', 'まちの駅魚沼'],
    whereToBuy: '幸源・うおぬま百菜花ん・サカキヤ・ウオロク・まちの駅魚沼',
    shopMessage: 'まずはそのまま、野菜と煮干しだしの旨みを味わってください。それから納豆と混ぜ合わせた「きりざい丼」で！是非、魚沼産コシヒカリときりざいと大力納豆で魚沼の味をお召し上がりください。',
    isPublished: false,
  },
  {
    productId: 'dairiki-natto',
    imageUrl: '', imageAlt: '糀入味付納豆（大力納豆）',
    shortDescription: '魚沼の夏納豆を現代風にアレンジ',
    description: '魚沼に伝わる郷土食「夏納豆」の現代版。国産大豆のふっくら中粒の納豆を、国産米米糀・笹川流れの塩・三河のみりんなどで味付調理しました。新潟県魚沼のお土産品として長年ご愛顧いただいております。魚沼市プレミアム認定商品。',
    externalUrl: 'https://www.dairikinatto.co.jp/',
    salesLocations: ['本社工場', '横町本店', '市内スーパー'],
    whereToBuy: '大力納豆本社工場・横町本店・市内スーパー',
    shopMessage: '疲れた体に魚沼コシヒカリとこの【夏納豆（糀入味付納豆）】（魚沼市プレミアム認定商品）でうんめぇ～まんま食ってくらっしゃい！！',
    isPublished: false,
  },
  {
    productId: 'yu-park-yakushi',
    imageUrl: '', imageAlt: 'ゆ～パーク薬師',
    shortDescription: '大会会場隣接の日帰り温泉・参加者割引あり',
    description: 'マラソン大会会場に隣接する日帰り温泉施設。大会参加者向けの入浴割引特典があり、ゴール後すぐに利用できる利便性が魅力です。移動の負担が少なく、レース後のリフレッシュに最適です。',
    externalUrl: 'http://www.yu-park.net/',
    salesLocations: [],
    whereToBuy: 'ゆ～パーク薬師（大会会場隣接）',
    isPublished: false,
  },
  {
    productId: 'kamiyu-onsen',
    imageUrl: '', imageAlt: '神湯温泉倶楽部',
    shortDescription: 'コース沿いの温泉・サウナ・ジャグジー完備',
    description: 'マラソンコース沿いに位置する日帰り温泉施設。豊かな自然に囲まれた落ち着いた環境の中で、温泉に加えサウナやジャグジーも備え、レース前後のコンディション調整や疲労回復に利用できます。大会参加者には入浴割引特典があります。',
    externalUrl: 'https://www.kamiyuonsen.com/',
    salesLocations: [],
    whereToBuy: '神湯温泉倶楽部（魚沼市・マラソンコース沿い）',
    isPublished: false,
  },
];

// 現在の productVisualSettings を取得
const { data: existing, error: fetchErr } = await supabase
  .from('admin_settings')
  .select('value')
  .eq('id', 'productVisualSettings')
  .single();

if (fetchErr && fetchErr.code !== 'PGRST116') {
  console.error('❌ 取得エラー:', fetchErr.message);
  process.exit(1);
}

let current = existing?.value ?? [];

for (const p of products) {
  const idx = current.findIndex(x => x.productId === p.productId);
  if (idx >= 0) {
    current[idx] = p;
    console.log(`🔄 更新: ${p.productId}`);
  } else {
    current.push(p);
    console.log(`✅ 追加: ${p.productId}`);
  }
}

const { error: saveErr } = await supabase
  .from('admin_settings')
  .upsert({ id: 'productVisualSettings', value: current });

if (saveErr) {
  console.error('❌ 保存エラー:', saveErr.message);
  process.exit(1);
}

console.log(`\n🎉 完了: ${products.length}件の productVisualSetting を登録しました（すべて isPublished: false）`);
