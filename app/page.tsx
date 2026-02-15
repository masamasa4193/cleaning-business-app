'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Wind, Home, Heart, TrendingUp, Calendar, Loader2, Download, Hash, BarChart3, Image as ImageIcon, Clock, Trash2 } from 'lucide-react';

interface Post {
  text: string;
}

interface HistoryItem {
  id: number;
  date: string;
  season: string;
  purpose: string;
  tone: string;
  posts: Post[];
  hashtags: string[];
}

interface ScheduledPost {
  id: number;
  post: string;
  date: string;
  time: string;
  hashtags: string[];
  season: string;
  purpose: string;
  tone: string;
}

interface ImagePrompt {
  prompt: string;
  note: string;
}

export default function CleaningBusinessApp() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [postHistory, setPostHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<number, ImagePrompt>>({});

  // 季節の自動選択
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSelectedSeason('spring');
    else if (month >= 6 && month <= 8) setSelectedSeason('summer');
    else if (month >= 9 && month <= 11) setSelectedSeason('autumn');
    else setSelectedSeason('winter');

    // APIキーの読み込み
    const savedApiKey = localStorage.getItem('anthropicApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // localStorage から履歴とスケジュールを読み込み
  useEffect(() => {
    const saved = localStorage.getItem('cleaningPostHistory');
    if (saved) setPostHistory(JSON.parse(saved));
    
    const savedSchedule = localStorage.getItem('scheduledPosts');
    if (savedSchedule) setScheduledPosts(JSON.parse(savedSchedule));
  }, []);

  // APIキー保存
  const saveApiKey = () => {
    if (!apiKey.trim()) {
      alert('APIキーを入力してください');
      return;
    }
    localStorage.setItem('anthropicApiKey', apiKey);
    setShowApiKeyInput(false);
    alert('APIキーを保存しました！');
  };

  // APIキー削除
  const clearApiKey = () => {
    if (confirm('APIキーを削除しますか？')) {
      localStorage.removeItem('anthropicApiKey');
      setApiKey('');
      setShowApiKeyInput(true);
    }
  };

  // 履歴を保存
  const saveToHistory = (posts: Post[], season: string, purpose: string, tone: string) => {
    const newHistory: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      season,
      purpose,
      tone,
      posts,
      hashtags: generateHashtags(season, purpose)
    };
    const updated = [newHistory, ...postHistory].slice(0, 50);
    setPostHistory(updated);
    localStorage.setItem('cleaningPostHistory', JSON.stringify(updated));
  };

  const resetAll = () => {
    setSelectedSeason('');
    setSelectedPurpose('');
    setSelectedTone('');
    setGeneratedPosts([]);
    setGeneratedImages({});
    
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSelectedSeason('spring');
    else if (month >= 6 && month <= 8) setSelectedSeason('summer');
    else if (month >= 9 && month <= 11) setSelectedSeason('autumn');
    else setSelectedSeason('winter');
  };

  const seasons = [
    { id: 'spring', label: '春（3〜5月）', emoji: '🌸', desc: '早期予約訴求' },
    { id: 'summer', label: '夏（6〜8月）', emoji: '☀️', desc: '繁忙期対応' },
    { id: 'autumn', label: '秋（9〜11月）', emoji: '🍂', desc: '暖房前メンテ' },
    { id: 'winter', label: '冬（12〜2月）', emoji: '⛄', desc: '閑散期需要喚起' }
  ];

  const purposes = [
    { id: 'booking', label: '予約促進', icon: Calendar, desc: '早期予約・希望日確保' },
    { id: 'trust', label: '信頼構築', icon: Heart, desc: 'ブランドストーリー' },
    { id: 'local', label: '地域密着', icon: Home, desc: '長野県への愛着' },
    { id: 'value', label: '価値提案', icon: TrendingUp, desc: '大手との差別化' },
    { id: 'service', label: 'サービス訴求', icon: Wind, desc: '技術・効果アピール' }
  ];

  const tones = [
    { id: 'family', label: '家族愛', emoji: '👨‍👩‍👧', desc: '子どもとの時間' },
    { id: 'local', label: '地元愛', emoji: '⛰️', desc: '長野への想い' },
    { id: 'professional', label: 'プロ意識', emoji: '💪', desc: '技術へのこだわり' },
    { id: 'gratitude', label: '感謝', emoji: '🙏', desc: 'お客様への感謝' }
  ];

  // ハッシュタグ生成
  const generateHashtags = (season: string, purpose: string) => {
    const baseTags = ['#エアコンクリーニング', '#長野県', '#ワークスS'];
    
    const seasonTags: Record<string, string[]> = {
      spring: ['#春のエアコンクリーニング', '#早期予約'],
      summer: ['#夏本番', '#エアコン快適'],
      autumn: ['#秋のメンテナンス', '#暖房前クリーニング'],
      winter: ['#冬のエアコン', '#暖房シーズン']
    };
    
    const purposeTags: Record<string, string[]> = {
      booking: ['#予約受付中', '#お早めに'],
      trust: ['#地域密着', '#信頼'],
      local: ['#長野で生まれ育った', '#地元愛'],
      value: ['#個人事業主', '#顔が見える'],
      service: ['#プロの技術', '#新品のような風']
    };
    
    const locationTags = ['#長野市', '#松本市', '#上田市', '#諏訪市'];
    
    return [
      ...baseTags,
      ...(seasonTags[season] || []),
      ...(purposeTags[purpose] || []),
      ...locationTags.slice(0, 2)
    ];
  };

  // 画像生成
  const generateImage = async (postText: string, index: number) => {
    if (!apiKey) {
      alert('APIキーが設定されていません');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imagePrompt = `エアコンクリーニングのイメージ画像を生成してください。以下の投稿内容に合った、温かみのあるプロフェッショナルな画像:

投稿内容: ${postText.substring(0, 200)}

画像の要素:
- エアコンのクリーニング作業
- 清潔感
- プロフェッショナル
- 長野県の自然（山、空など）を背景に
- 明るく爽やかな雰囲気
- 写真風のリアルなスタイル`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          systemPrompt: '',
          userPrompt: `画像生成プロンプトを最適化してください。以下の要件に基づいて、DALL-E や Midjourney 用の英語プロンプトを作成してください:\n\n${imagePrompt}\n\n短く簡潔な英語のプロンプトのみを返してください。`,
          mode: 'image'
        })
      });

      const data = await response.json();
      const optimizedPrompt = data.content.find((c: any) => c.type === 'text')?.text || '';
      
      setGeneratedImages(prev => ({
        ...prev,
        [index]: {
          prompt: optimizedPrompt,
          note: '※ このプロンプトを画像生成AIに入力してください（DALL-E、Midjourney等）'
        }
      }));

    } catch (error) {
      console.error('Error:', error);
      alert('画像プロンプトの生成に失敗しました');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 投稿のスケジュール追加
  const schedulePost = (post: Post, index: number) => {
    const date = prompt('投稿予定日を入力してください (例: 2026-03-15):');
    if (!date) return;
    
    const time = prompt('投稿予定時刻を入力してください (例: 10:00):');
    if (!time) return;

    const scheduled: ScheduledPost = {
      id: Date.now(),
      post: post.text,
      date,
      time,
      hashtags: generateHashtags(selectedSeason, selectedPurpose),
      season: selectedSeason,
      purpose: selectedPurpose,
      tone: selectedTone
    };

    const updated = [...scheduledPosts, scheduled].sort((a, b) => 
      new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    );
    
    setScheduledPosts(updated);
    localStorage.setItem('scheduledPosts', JSON.stringify(updated));
    alert('投稿をスケジュールに追加しました!');
  };

  // スケジュール削除
  const removeScheduled = (id: number) => {
    const updated = scheduledPosts.filter(p => p.id !== id);
    setScheduledPosts(updated);
    localStorage.setItem('scheduledPosts', JSON.stringify(updated));
  };

  // エクスポート機能
  const exportPosts = () => {
    if (generatedPosts.length === 0) {
      alert('エクスポートする投稿がありません');
      return;
    }

    const hashtags = generateHashtags(selectedSeason, selectedPurpose);
    const content = generatedPosts.map((post, index) => {
      return `【パターン ${index + 1}】
${post.text}

推奨ハッシュタグ:
${hashtags.join(' ')}

文字数: ${post.text.length}文字
━━━━━━━━━━━━━━━━━━━━
`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threads投稿_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 分析データの計算
  const getAnalytics = () => {
    const seasonCount: Record<string, number> = {};
    const purposeCount: Record<string, number> = {};
    const toneCount: Record<string, number> = {};
    
    postHistory.forEach(item => {
      seasonCount[item.season] = (seasonCount[item.season] || 0) + 1;
      purposeCount[item.purpose] = (purposeCount[item.purpose] || 0) + 1;
      toneCount[item.tone] = (toneCount[item.tone] || 0) + 1;
    });

    return { seasonCount, purposeCount, toneCount, total: postHistory.length };
  };

  const generatePosts = async () => {
    if (!apiKey) {
      alert('APIキーが設定されていません');
      setShowApiKeyInput(true);
      return;
    }

    if (!selectedSeason || !selectedPurpose || !selectedTone) {
      alert('すべての項目を選択してください');
      return;
    }

    setIsGenerating(true);

    try {
      const seasonLabel = seasons.find(s => s.id === selectedSeason)?.label;
      const purposeLabel = purposes.find(p => p.id === selectedPurpose)?.label;
      const toneLabel = tones.find(t => t.id === selectedTone)?.label;

      const systemPrompt = `あなたはエアコンクリーニング業を営む40代自営業パパ「篠原翔吾」のThreads投稿を作成する専門家です。

# 事業者プロフィール
- 会社名: ワークス-S（ワークスエス）
- 代表: 篠原翔吾（40代）
- 家族構成: 奥さんと子ども1人
- 対応エリア: 長野県全域（北信・北信州を除く）
- 価格帯: 家庭用ノーマル 9,000円、お掃除機能付き 12,000円
- 強み: 地域密着型、プロの分解洗浄、顔が見える安心感

# ブランドメッセージ
- 「地域密着だからこそできる、迅速・丁寧な対応」
- 「新品のような風が蘇る」
- 「一台一台丁寧に仕上げます」
- 家族のために働く、子どもとの時間を大切にする自営業パパ

上記の例を参考に、指定された条件で3つの投稿を生成してください。
各投稿は完全に異なる内容、異なる切り口にしてください。
JSONフォーマットで返してください：
{
  "posts": [
    {"text": "投稿1の内容"},
    {"text": "投稿2の内容"},
    {"text": "投稿3の内容"}
  ]
}`;

      const userPrompt = `以下の条件でThreads投稿を3つ生成してください：

- 季節: ${seasonLabel}
- 投稿目的: ${purposeLabel}
- トーン: ${toneLabel}

必ず3つの異なる投稿を生成し、JSON形式で返してください。`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          systemPrompt,
          userPrompt,
          mode: 'post'
        })
      });

      if (!response.ok) {
        throw new Error('投稿の生成に失敗しました');
      }

      const data = await response.json();
      const textContent = data.content.find((c: any) => c.type === 'text')?.text || '';
      
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('投稿の生成に失敗しました');
      }

      const result = JSON.parse(jsonMatch[0]);
      setGeneratedPosts(result.posts || []);
      
      saveToHistory(result.posts || [], selectedSeason, selectedPurpose, selectedTone);

    } catch (error) {
      console.error('Error:', error);
      alert('投稿の生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      const hashtags = generateHashtags(selectedSeason, selectedPurpose);
      const fullText = `${text}\n\n${hashtags.join(' ')}`;
      await navigator.clipboard.writeText(fullText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      alert('コピーに失敗しました');
    }
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* API Key Input Modal */}
        {showApiKeyInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">APIキー設定</h2>
              <p className="text-sm text-gray-600 mb-4">
                Anthropic APIキーを入力してください。
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  こちらで取得
                </a>
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={saveApiKey}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  保存
                </button>
                {apiKey && (
                  <button
                    onClick={() => setShowApiKeyInput(false)}
                    className="px-6 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Wind className="w-10 h-10 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-600 bg-clip-text text-transparent">
              ワークス-S
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">エアコンクリーニング専用</p>
          <p className="text-sm text-gray-500 mb-4">Threads投稿自動生成ツール（AI搭載）</p>
          
          {/* API Key Status */}
          {apiKey && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm mb-4">
              <Check className="w-4 h-4" />
              <span>APIキー設定済み</span>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="ml-2 text-green-600 hover:text-green-800 underline text-xs"
              >
                変更
              </button>
              <button
                onClick={clearApiKey}
                className="text-red-600 hover:text-red-800 underline text-xs"
              >
                削除
              </button>
            </div>
          )}
          
          {/* Top Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {(selectedSeason || selectedPurpose || selectedTone || generatedPosts.length > 0) && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">最初からやり直す</span>
              </button>
            )}
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-all duration-300"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">履歴 ({postHistory.length})</span>
            </button>
            
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">分析</span>
            </button>
            
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">スケジュール ({scheduledPosts.length})</span>
            </button>
            
            {generatedPosts.length > 0 && (
              <button
                onClick={exportPosts}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">エクスポート</span>
              </button>
            )}
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-500" />
              投稿分析
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-gray-700 mb-2">季節別生成回数</h3>
                {Object.entries(analytics.seasonCount).map(([season, count]) => (
                  <div key={season} className="flex justify-between py-1">
                    <span>{seasons.find(s => s.id === season)?.label}</span>
                    <span className="font-bold">{count}回</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-2">目的別生成回数</h3>
                {Object.entries(analytics.purposeCount).map(([purpose, count]) => (
                  <div key={purpose} className="flex justify-between py-1">
                    <span>{purposes.find(p => p.id === purpose)?.label}</span>
                    <span className="font-bold">{count}回</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-2">トーン別生成回数</h3>
                {Object.entries(analytics.toneCount).map(([tone, count]) => (
                  <div key={tone} className="flex justify-between py-1">
                    <span>{tones.find(t => t.id === tone)?.label}</span>
                    <span className="font-bold">{count}回</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-600">合計生成回数: <span className="font-bold text-2xl text-blue-600">{analytics.total}</span>回</p>
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-500" />
              投稿履歴
            </h2>
            {postHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">まだ履歴がありません</p>
            ) : (
              <div className="space-y-4">
                {postHistory.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {seasons.find(s => s.id === item.season)?.label}
                        </span>
                        <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">
                          {purposes.find(p => p.id === item.purpose)?.label}
                        </span>
                        <span className="text-xs px-2 py-1 bg-sky-100 text-sky-700 rounded">
                          {tones.find(t => t.id === item.tone)?.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.posts.length}件の投稿を生成</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scheduler Panel */}
        {showScheduler && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-500" />
              投稿スケジュール
            </h2>
            {scheduledPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">スケジュールされた投稿がありません</p>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-lg text-gray-800 mb-1">
                          {item.date} {item.time}
                        </div>
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {seasons.find(s => s.id === item.season)?.label}
                          </span>
                          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">
                            {purposes.find(p => p.id === item.purpose)?.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeScheduled(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2 line-clamp-3">
                      {item.post}
                    </p>
                    <div className="text-xs text-gray-500">
                      {item.hashtags.join(' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selection Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          {/* Season Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              季節選択
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seasons.map(season => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedSeason === season.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{season.emoji}</div>
                  <div className="text-base font-bold text-gray-800 mb-1">{season.label}</div>
                  <div className="text-xs text-gray-600">{season.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-500" />
              投稿目的
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purposes.map(purpose => {
                const Icon = purpose.icon;
                return (
                  <button
                    key={purpose.id}
                    onClick={() => setSelectedPurpose(purpose.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedPurpose === purpose.id
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3 text-cyan-600" />
                    <div className="text-base font-bold text-gray-800 mb-1">{purpose.label}</div>
                    <div className="text-xs text-gray-600">{purpose.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-sky-500" />
              トーン
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tones.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedTone === tone.id
                      ? 'border-sky-500 bg-sky-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{tone.emoji}</div>
                  <div className="text-base font-bold text-gray-800 mb-1">{tone.label}</div>
                  <div className="text-xs text-gray-600">{tone.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePosts}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                AI が投稿を生成中...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wind className="w-5 h-5" />
                投稿を生成する
              </span>
            )}
          </button>
        </div>

        {/* Generated Posts */}
        {generatedPosts.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                生成された投稿
              </h2>
              <button
                onClick={generatePosts}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span className="font-medium">別のパターンを生成</span>
              </button>
            </div>

            {/* Hashtag Suggestions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-500" />
                推奨ハッシュタグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {generateHashtags(selectedSeason, selectedPurpose).map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">※ コピー時に自動で含まれます</p>
            </div>

            {generatedPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                    パターン {index + 1}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => schedulePost(post, index)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all duration-300"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">スケジュール</span>
                    </button>
                    <button
                      onClick={() => generateImage(post.text, index)}
                      disabled={isGeneratingImage}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition-all duration-300 disabled:opacity-50"
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">画像</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(post.text, index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        copiedIndex === index
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">コピー完了!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm font-medium">コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Character Count */}
                <div className="mb-3">
                  <span className={`text-sm font-medium ${
                    post.text.length > 500 ? 'text-red-600' : 
                    post.text.length > 400 ? 'text-orange-600' : 
                    'text-green-600'
                  }`}>
                    文字数: {post.text.length}文字
                    {post.text.length > 500 && ' (長すぎる可能性があります)'}
                  </span>
                </div>

                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed border-l-4 border-blue-300 pl-6 py-2 mb-4">
                  {post.text}
                </div>

                {/* Generated Image Prompt */}
                {generatedImages[index] && (
                  <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      画像生成用プロンプト
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">{generatedImages[index].prompt}</p>
                    <p className="text-xs text-pink-600">{generatedImages[index].note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
