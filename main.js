const examples = {
  manager: '6月15日に渋谷でライブがあります。新規の人にも来てほしいです。初めての人にも安心して来てもらえる告知にしたいです。',
  academy: 'ライブ後の投稿がいつも同じになってしまいます。もっとファンが反応したくなる投稿にしたいです。',
  coach: 'ライブ中に表情が硬いと言われます。客席を見るのも苦手です。もっとステージで目立ちたいです。MCも安定させたいです。',
};

const icons = {
  manager: '▣',
  academy: '✓',
  coach: '✧',
};

const pick = (form, name) => new FormData(form).get(name)?.toString().trim() || '';

function resultCard(title, body, ordered = false) {
  const card = document.createElement('article');
  card.className = 'result-card';
  const bodyMarkup = ordered
    ? `<ol>${body.map((item) => `<li>${item}</li>`).join('')}</ol>`
    : `<p>${body}</p>`;

  card.innerHTML = `
    <header>
      <h3><span>${icons.manager}</span>${title}</h3>
      <button class="copy-btn" type="button">▣ コピー</button>
    </header>
    ${bodyMarkup}
  `;

  const copyButton = card.querySelector('.copy-btn');
  copyButton.addEventListener('click', async () => {
    const text = ordered ? body.join('\n') : body;
    await navigator.clipboard?.writeText(text);
    copyButton.textContent = '✓ コピー済み';
    setTimeout(() => { copyButton.textContent = '▣ コピー'; }, 1400);
  });

  return card;
}

function renderManager(form) {
  const group = pick(form, 'group') || 'グループ';
  const idol = pick(form, 'idol') || 'あなた';
  const content = pick(form, 'content');
  return [
    resultCard('X 投稿', `${content}\n\n${idol}です。${group}をまだ見たことない人にも届いてほしいライブです。\n「行くよ」ってコメントで教えてくれたら、めちゃくちゃ嬉しいです♡\n保存して、当日忘れないでね🕊️\n.\n#地下アイドル #アイドル好きさんと繋がりたい #idol`),
    resultCard('TikTok企画', `【ライブ告知】TikTok企画案 — わたし\n①掴み(0-2秒)：今日の予定をテロップで一気見せ → 顔アップでにころ\n②本編(2-12秒)：わかりやすい雰囲気でサビの振りを正面から\n③オチ(12-15秒)：「続きは現場で！」→ 日時を大きく表示\n🎵 おすすめ音源：トレンドのアップテンポ曲 / 自分の持ち歌サビ\n💬 コメント誘導：「どのポーズがいい？①②③で教えて」`),
    resultCard('ひとことMC', `今日は来てくれてありがとう。初めて見てくれた人も、いつも応援してくれる人も、ここにいる全員に「また会いたい」と思ってもらえる時間にします。`),
  ];
}

function renderAcademy(form) {
  const category = pick(form, 'category');
  const content = pick(form, 'content');
  return [
    resultCard(`${category}の整理`, `相談内容：${content}\n\n今の課題は「投稿の型」が固定されていることです。でも、ライブ後に発信を続けられているのは大きな強みです。感謝だけで終わらせず、次の会話が生まれる問いかけを最後に置くと反応が増えやすくなります。`),
    resultCard('次にやること3つ', [
      '投稿の最後を必ず「問いかけ」で締める（1週間試す）',
      '反応が良かった投稿を3つ保存して型を見つける',
      '週1で“お礼だけ”ではない裏側投稿を入れる',
    ], true),
    resultCard('そのまま使える文章例', `今日のライブ、来てくれてありがとう！\n正直、新曲のサビは緊張したけど、みんなの声で前を向けました。\n次は◯◯な演出やってみたいんだけど…見たい人ー？🙋‍♀️\n「行く」コメントくれたら泣いて喜びます。`),
  ];
}

function renderCoach(form) {
  const url = pick(form, 'url');
  const content = pick(form, 'content');
  return [
    resultCard('表情・視線・動きの改善', `${url ? `参考URL：${url}\n` : ''}振り返り：${content}\n\n表情は「サビ頭だけ先に笑顔を作る」と硬さが抜けやすくなります。視線は客席を3ブロックに分け、1ブロックずつ1秒送るだけで会場全体に届けている印象になります。動きの質は悪くありません。次は立ち位置の使い方。サビで半歩前に出るなど、前後移動を1曲に1回足すと存在感が増します。`),
    resultCard('MCの改善', '安心感はあります。あとは「自分の言葉のキーフレーズ」を1つ決めて毎回使うと、新規さんが覚えやすくなり“あの子”になれます。'),
    resultCard('次回ライブで意識すること3つ', [
      'この曲のサビ頭で「決め笑顔」を1回だけ作る',
      '会場を3ブロックに分けて、新規席へ1回必ず視線を送る',
      'MCの最後を「次の約束」で締める',
    ], true),
  ];
}

const renderers = { manager: renderManager, academy: renderAcademy, coach: renderCoach };

document.querySelectorAll('.example').forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    const textarea = form.querySelector('textarea[name="content"]');
    textarea.value = examples[button.dataset.example];
    textarea.focus();
  });
});

document.querySelectorAll('.tool-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const tool = form.dataset.tool;
    const results = document.querySelector(`#${tool}-results`);
    results.replaceChildren(...renderers[tool](form));
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
