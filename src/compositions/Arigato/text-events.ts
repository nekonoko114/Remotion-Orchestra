/**
 * ArigatoMV Text Events Data
 * 
 * このファイルで動画内のテキストタイミングを管理します。
 * タイミングを増やしたい場合は、配列内にオブジェクトを追加してください。
 */

export const ARIGATO_TEXT_EVENTS = [
  { 
    startFrame: 300, 
    durationInFrames: 150, 
    text: "家に来てくれてありがとう" 
  },
  { 
    startFrame: 450, 
    durationInFrames: 150, 
    text: "大切な家族だよ" 
  },
  { 
    startFrame: 600, 
    durationInFrames: 150, 
    text: "たくさんの思い出をありがとう" 
  },
  { 
    startFrame: 1400, 
    durationInFrames: 200, 
    text: "みーさんの指をかじる" 
  },
  { 
    startFrame: 1700, 
    durationInFrames: 400, 
    text: "４匹の猫と戯れて戯れていたね" 
  },
  { 
    startFrame: 2200, 
    durationInFrames: 400, 
    //改行の仕方は\n
    text: "小さい頃は\nよく走り回って\n好奇心旺盛だったね" 
  },
  { 
    startFrame: 2600, 
    durationInFrames: 400, 
    text: "テンションが上がると顎を黒くして\nよく[ハァ〜！]と怒っていたね" 
    //改行の仕方
  },
  { 
    startFrame: 3000, 
    durationInFrames: 400, 
    text: "野菜もすきでたくさん食べたね" 
  },
  { 
    startFrame: 3400, 
    durationInFrames: 200, 
    text: "お風呂もすきでよく泳いだね" 
  },

  // ここにどんどん追加していけます
  // { startFrame: 900, durationInFrames: 150, text: "新しいメッセージ" },
];
