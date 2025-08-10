import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Shuffle, Eye, Clock, Heart, Target, Zap, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { callGeminiAPI, getFallbackInterpretation, TarotInterpretationRequest } from "@/lib/gemini";
import TarotModal from "@/components/TarotModal";
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Major Arcana cards (22 lá)
const majorArcana = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

// Minor Arcana - Cups (Cốc) - 14 lá
const cups = [
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
  "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
  "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups"
];

// Minor Arcana - Wands (Gậy) - 14 lá
const wands = [
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
  "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
  "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands"
];

// Minor Arcana - Swords (Kiếm) - 14 lá
const swords = [
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
  "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
  "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords"
];

// Minor Arcana - Pentacles (Đồng xu) - 14 lá
const pentacles = [
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
  "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
  "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

// Complete tarot deck (78 lá)
const completeTarotDeck = [
  ...majorArcana,
  ...cups,
  ...wands,
  ...swords,
  ...pentacles
];

// Spread options
const spreadOptions = [
  {
    id: "past-present-future",
    name: "Quá khứ - Hiện tại - Tương lai",
    description: "Xem xét hành trình thời gian",
    cardCount: 3,
    positions: ["Quá khứ", "Hiện tại", "Tương lai"]
  },
  {
    id: "situation-action-outcome",
    name: "Tình huống - Hành động - Kết quả",
    description: "Tập trung vào hành động",
    cardCount: 3,
    positions: ["Tình huống", "Hành động", "Kết quả"]
  },
  {
    id: "mind-body-spirit",
    name: "Tâm trí - Thể xác - Tinh thần",
    description: "Cân bằng ba khía cạnh",
    cardCount: 3,
    positions: ["Tâm trí", "Thể xác", "Tinh thần"]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross (Rút gọn)",
    description: "Trải bài chi tiết",
    cardCount: 5,
    positions: ["Trung tâm", "Thách thức", "Quá khứ", "Tương lai", "Kết quả"]
  },
  {
    id: "single-card",
    name: "Một lá bài",
    description: "Câu trả lời đơn giản",
    cardCount: 1,
    positions: ["Câu trả lời"]
  },
  {
    id: "two-cards",
    name: "Hai lá bài",
    description: "So sánh hai lựa chọn",
    cardCount: 2,
    positions: ["Lựa chọn 1", "Lựa chọn 2"]
  }
];

// Question suggestions
const questionSuggestions = [
  "Tôi nên làm gì để cải thiện mối quan hệ hiện tại?",
  "Công việc hiện tại có phù hợp với tôi không?",
  "Làm thế nào để vượt qua khó khăn này?",
  "Tôi có nên thay đổi hướng đi trong cuộc sống không?",
  "Điều gì đang ngăn cản tôi đạt được mục tiêu?",
  "Tôi cần tập trung vào điều gì trong thời gian tới?",
  "Làm sao để tìm thấy hạnh phúc thực sự?",
  "Tôi có nên tin tưởng vào quyết định này không?"
];

const tarotImageMap: Record<string, string> = {
  // Major Arcana
  "The Fool": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m00.jpg",
  "The Magician": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m01.jpg",
  "The High Priestess": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m02.jpg",
  "The Empress": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m03.jpg",
  "The Emperor": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m04.jpg",
  "The Hierophant": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m05.jpg",
  "The Lovers": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m06.jpg",
  "The Chariot": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m07.jpg",
  "Strength": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m08.jpg",
  "The Hermit": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m09.jpg",
  "Wheel of Fortune": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m10.jpg",
  "Justice": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m11.jpg",
  "The Hanged Man": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m12.jpg",
  "Death": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m13.jpg",
  "Temperance": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m14.jpg",
  "The Devil": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m15.jpg",
  "The Tower": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m16.jpg",
  "The Star": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m17.jpg",
  "The Moon": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m18.jpg",
  "The Sun": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg",
  "Judgement": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m20.jpg",
  "The World": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m21.jpg",
  
  // Wands
  "Ace of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg",
  "Two of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w02.jpg",
  "Three of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w03.jpg",
  "Four of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w04.jpg",
  "Five of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w05.jpg",
  "Six of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w06.jpg",
  "Seven of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w07.jpg",
  "Eight of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w08.jpg",
  "Nine of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w09.jpg",
  "Ten of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w10.jpg",
  "Page of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w11.jpg",
  "Knight of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w12.jpg",
  "Queen of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w13.jpg",
  "King of Wands": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w14.jpg",
  
  // Cups
  "Ace of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg",
  "Two of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c02.jpg",
  "Three of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c03.jpg",
  "Four of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c04.jpg",
  "Five of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c05.jpg",
  "Six of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c06.jpg",
  "Seven of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c07.jpg",
  "Eight of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c08.jpg",
  "Nine of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c09.jpg",
  "Ten of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c10.jpg",
  "Page of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c11.jpg",
  "Knight of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c12.jpg",
  "Queen of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c13.jpg",
  "King of Cups": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c14.jpg",
  
  // Swords
  "Ace of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg",
  "Two of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s02.jpg",
  "Three of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s03.jpg",
  "Four of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s04.jpg",
  "Five of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s05.jpg",
  "Six of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s06.jpg",
  "Seven of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s07.jpg",
  "Eight of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s08.jpg",
  "Nine of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s09.jpg",
  "Ten of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s10.jpg",
  "Page of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s11.jpg",
  "Knight of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s12.jpg",
  "Queen of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s13.jpg",
  "King of Swords": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s14.jpg",
  
  // Pentacles
  "Ace of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg",
  "Two of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p02.jpg",
  "Three of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p03.jpg",
  "Four of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p04.jpg",
  "Five of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p05.jpg",
  "Six of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p06.jpg",
  "Seven of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p07.jpg",
  "Eight of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p08.jpg",
  "Nine of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p09.jpg",
  "Ten of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p10.jpg",
  "Page of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p11.jpg",
  "Knight of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p12.jpg",
  "Queen of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p13.jpg",
  "King of Pentacles": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p14.jpg"
};

const DrawCards = () => {
  const location = useLocation();
  const [selectedSpread, setSelectedSpread] = useState("past-present-future");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<Array<{ name: string; reversed: boolean }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [autoInterpret, setAutoInterpret] = useState(false);

  const selectedSpreadData = spreadOptions.find(spread => spread.id === selectedSpread);

  // Mobile tab navigation items
  const mobileNavItems = [
    {
      path: '/',
      label: 'Bốc Bài',
      icon: Eye,
      isActive: location.pathname === '/'
    },
    {
      path: '/interpret',
      label: 'Giải Bài',
      icon: Sparkles,
      isActive: location.pathname === '/interpret'
    },
    {
      path: '/cards',
      label: 'Tra Bài',
      icon: BookOpen,
      isActive: location.pathname === '/cards'
    }
  ];

  const drawCards = () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập câu hỏi trước khi bốc bài");
      return;
    }

    setIsDrawing(true);
    setInterpretation("");
    setShowModal(true);
    setAutoInterpret(false);
    
    setTimeout(() => {
      const shuffled = [...completeTarotDeck].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, selectedSpreadData?.cardCount || 3).map(name => ({
        name,
        reversed: Math.random() < 0.5 // 50% ngược
      }));
      setDrawnCards(drawn);
      setIsDrawing(false);
      setAutoInterpret(true); // Trigger auto AI
      toast.success(`Đã bốc được ${drawn.length} lá bài!`);
    }, 2000);
  };

  // Tự động gọi AI khi vừa bốc bài xong
  React.useEffect(() => {
    if (autoInterpret && drawnCards.length > 0 && !isDrawing) {
      interpretCards();
      setAutoInterpret(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoInterpret, drawnCards, isDrawing]);

  const interpretCards = async () => {
    if (drawnCards.length === 0) {
      toast.error("Vui lòng bốc bài trước khi giải nghĩa");
      return;
    }

    setIsInterpreting(true);
    setInterpretation("");
    setShowModal(true);

    try {
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: selectedSpreadData?.name || "Trải bài",
        cards: drawnCards.map(card => `${card.name} ${card.reversed ? '(Ngược)' : '(Xuôi)'}`),
        spreadPositions: selectedSpreadData?.positions || []
      };

      const result = await callGeminiAPI(request);
      setInterpretation(result);
      toast.success("Đã hoàn thành giải nghĩa với AI!");
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to mock interpretation
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: selectedSpreadData?.name || "Trải bài",
        cards: drawnCards.map(card => `${card.name} ${card.reversed ? '(Ngược)' : '(Xuôi)'}`),
        spreadPositions: selectedSpreadData?.positions || []
      };
      
      const fallbackResult = getFallbackInterpretation(request);
      setInterpretation(fallbackResult);
      
      toast.error("Không thể kết nối AI. Đang sử dụng giải nghĩa mẫu. Vui lòng kiểm tra API key.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
  };

  return (
    <>
      <TarotModal
        open={showModal}
        loading={isDrawing || isInterpreting}
        cards={drawnCards.map(card => ({ name: card.name, image: tarotImageMap[card.name], reversed: card.reversed }))}
        aiResult={interpretation}
        onClose={() => setShowModal(false)}
      />
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:block">
            <Navigation />
          </div>
          
          {/* Mobile Tab Navigation - Only visible on mobile */}
          <div className="md:hidden mb-6">
            <div className="bg-muted/30 rounded-lg p-1">
              <div className="flex gap-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path} className="flex-1">
                      <div className={`
                        flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all duration-300 cursor-pointer
                        ${item.isActive 
                          ? 'bg-gradient-primary text-primary-foreground shadow-md scale-105' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}>
                        <Icon className={`h-5 w-5 mb-1 ${
                          item.isActive ? 'text-primary-foreground' : 'text-current'
                        }`} />
                        <span className={`text-xs font-medium text-center leading-tight ${
                          item.isActive ? 'text-primary-foreground' : 'text-current'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Card className="p-4 sm:p-6 md:p-8 shadow-card">
            <div className="text-center mb-6 sm:mb-8">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-primary animate-mystical-glow" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Bốc Bài Tarot</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Đặt câu hỏi và để vũ trụ chọn bài cho bạn</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Spread Selection */}
              <div>
                <Label className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 block">
                  Chọn kiểu trải bài
                </Label>
                <Select value={selectedSpread} onValueChange={setSelectedSpread}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn kiểu trải bài" />
                  </SelectTrigger>
                  <SelectContent>
                    {spreadOptions.map((spread) => (
                      <SelectItem key={spread.id} value={spread.id}>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm sm:text-base">{spread.name}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{spread.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Input */}
              <div>
                <Label htmlFor="question" className="text-base sm:text-lg font-semibold">
                  Câu hỏi của bạn
                </Label>
                <Textarea
                  id="question"
                  placeholder="Nhập câu hỏi bạn muốn hỏi tarot..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-2 min-h-[80px] sm:min-h-[100px] bg-muted/50"
                />
                
                {/* Question Suggestions */}
                <div className="mt-3">
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Gợi ý câu hỏi:
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {questionSuggestions.slice(0, 6).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestion(suggestion)}
                        className="text-xs text-left justify-start h-auto p-2"
                      >
                        <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Draw Button */}
              <div className="text-center">
                <Button
                  onClick={drawCards}
                  disabled={isDrawing}
                  className="bg-gradient-primary hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
                >
                  {isDrawing ? (
                    <>
                      <Shuffle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Đang bốc bài...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Bốc {selectedSpreadData?.cardCount || 3} Lá Bài
                    </>
                  )}
                </Button>
              </div>

              {/* Drawn Cards */}
              {drawnCards.length > 0 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className={`grid gap-3 sm:gap-4 ${
                    drawnCards.length === 1 ? 'grid-cols-1 max-w-sm sm:max-w-md mx-auto' :
                    drawnCards.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                  }`}>
                    {drawnCards.map((cardObj, index) => (
                      <Card key={index} className="p-4 sm:p-6 text-center bg-gradient-mystical animate-float shadow-mystical">
                        <div className="mb-2 sm:mb-3">
                          <div className="w-14 h-20 sm:w-16 sm:h-24 bg-primary/20 rounded-lg mx-auto mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                            {tarotImageMap[cardObj.name] ? (
                              <img
                                src={tarotImageMap[cardObj.name]}
                                alt={cardObj.name}
                                className={`object-cover w-full h-full ${cardObj.reversed ? 'rotate-180' : ''}`}
                              />
                            ) : (
                              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            )}
                          </div>
                          <h3 className="font-semibold text-primary-foreground text-xs sm:text-sm">
                            {cardObj.name} {cardObj.reversed ? '(Ngược)' : '(Xuôi)'}
                          </h3>
                        </div>
                        <p className="text-xs text-primary-foreground/80">
                          {selectedSpreadData?.positions[index] || `Vị trí ${index + 1}`}
                        </p>
                      </Card>
                    ))}
                  </div>

                  {/* Interpretation */}
                  {interpretation && (
                    <Card className="p-4 sm:p-6 bg-muted/50">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary">Lời Giải Nghĩa</h3>
                      <div className="whitespace-pre-line text-foreground text-sm sm:text-base">
                        {interpretation}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DrawCards;