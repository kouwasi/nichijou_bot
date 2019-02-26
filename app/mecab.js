const MeCab = new require('mecab-async');

MeCab.command = "mecab -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/";

String.prototype.toGenshi = function() {
  let text = this.toString();
  let morphs = MeCab.parseSyncFormat(text);
  let replyArray = [];

  morphs.map(x => x.lexical != '助詞' ? replyArray.push(x.reading) : '');

  return replyArray.join(' ');
}

let aaaa = "構文解析して助詞を消す";

console.log(aaaa.toGenshi())