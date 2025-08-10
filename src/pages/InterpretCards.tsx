import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, X, Crown, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { callGeminiAPI, getFallbackInterpretation, TarotInterpretationRequest } from "@/lib/gemini";
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

// Thêm tarotImageMap
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

const InterpretCards = () => {
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [selectedCards, setSelectedCards] = useState<Array<{ name: string; reversed: boolean }>>([]);
  const [interpretation, setInterpretation] = useState("");
  const [activeTab, setActiveTab] = useState("major");
  const [isInterpreting, setIsInterpreting] = useState(false);

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
      icon: Crown,
      isActive: location.pathname === '/interpret'
    },
    {
      path: '/cards',
      label: 'Tra Bài',
      icon: Heart,
      isActive: location.pathname === '/cards'
    }
  ];

  const addCard = (card: string, reversed: boolean = false) => {
    const cardExists = selectedCards.find(c => c.name === card);
    if (!cardExists) {
      setSelectedCards([...selectedCards, { name: card, reversed }]);
      toast.success(`Đã thêm ${card}${reversed ? ' (ngược)' : ''}`);
    } else {
      toast.error("Lá bài này đã được chọn");
    }
  };

  const removeCard = (index: number) => {
    const newCards = selectedCards.filter((_, i) => i !== index);
    setSelectedCards(newCards);
  };

  const toggleCardOrientation = (index: number) => {
    const newCards = [...selectedCards];
    newCards[index].reversed = !newCards[index].reversed;
    setSelectedCards(newCards);
  };

  const interpretCards = async () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập câu hỏi");
      return;
    }
    
    if (selectedCards.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 lá bài");
      return;
    }

    setIsInterpreting(true);
    setInterpretation("");

    try {
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: "Trải bài tùy chọn",
        cards: selectedCards.map(card => card.name),
        spreadPositions: selectedCards.map((_, index) => `Vị trí ${index + 1}`),
        cardOrientations: selectedCards.map(card => card.reversed ? "reversed" : "upright")
      };

      // Try to call Gemini API
      const result = await callGeminiAPI(request);
      setInterpretation(result);
      toast.success("Đã hoàn thành giải nghĩa với AI!");
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to mock interpretation
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: "Trải bài tùy chọn",
        cards: selectedCards.map(card => card.name),
        spreadPositions: selectedCards.map((_, index) => `Vị trí ${index + 1}`),
        cardOrientations: selectedCards.map(card => card.reversed ? "reversed" : "upright")
      };
      
      const fallbackResult = getFallbackInterpretation(request);
      setInterpretation(fallbackResult);
      
      toast.error("Không thể kết nối AI. Đang sử dụng giải nghĩa mẫu. Vui lòng kiểm tra API key.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const renderCardGrid = (cards: string[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
      {cards.map((card) => (
        <Card key={card} className="p-3 sm:p-4 bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-200">
          <div className="text-center mb-2 sm:mb-3">
            <div className="w-14 h-20 sm:w-16 sm:h-24 bg-background/80 rounded-lg mx-auto mb-2 sm:mb-3 overflow-hidden flex items-center justify-center shadow-sm">
              {tarotImageMap[card] ? (
                <img src={tarotImageMap[card]} alt={card} className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs text-muted-foreground text-center p-2">{card}</span>
              )}
            </div>
            <h4 className="font-medium text-xs sm:text-sm text-foreground mb-2 sm:mb-3">{card}</h4>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => addCard(card, false)}
              variant="outline"
              size="sm"
              className={`flex-1 text-xs transition-all duration-200 ${
                selectedCards.some(c => c.name === card && !c.reversed)
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'hover:bg-primary/10 hover:border-primary/50'
              }`}
              disabled={selectedCards.some(c => c.name === card && !c.reversed)}
            >
              Xuôi
            </Button>
            <Button
              onClick={() => addCard(card, true)}
              variant="outline"
              size="sm"
              className={`flex-1 text-xs transition-all duration-200 ${
                selectedCards.some(c => c.name === card && c.reversed)
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'hover:bg-primary/10 hover:border-primary/50'
              }`}
              disabled={selectedCards.some(c => c.name === card && c.reversed)}
            >
              Ngược
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderCardImagesGrid = (cards: string[]) => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto mb-4">
      {cards.map((card) => (
        <div key={card} className="flex flex-col items-center">
          <div className="w-20 h-32 rounded-lg bg-background/80 shadow border border-primary/30 mb-2 overflow-hidden flex items-center justify-center">
            {tarotImageMap[card] ? (
              <img src={tarotImageMap[card]} alt={card} className="object-cover w-full h-full" />
            ) : (
              <span className="text-xs text-primary-foreground text-center p-2">{card}</span>
            )}
          </div>
          <span className="text-xs text-center text-primary-foreground/80">{card}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
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
            <Eye className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-primary animate-mystical-glow" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Giải Bài Tarot</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Chọn những lá bài bạn đã rút và nhận được lời giải nghĩa</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
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
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Label className="text-base sm:text-lg font-semibold">
                  Những lá bài đã chọn ({selectedCards.length})
                </Label>
              </div>

              {selectedCards.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  {selectedCards.map((card, index) => (
                    <Card key={index} className="p-2 sm:p-3 bg-gradient-mystical relative group">
                      <Button
                        onClick={() => removeCard(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 p-0 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-2 w-2 sm:h-3 sm:w-3" />
                      </Button>
                      <div className="text-center">
                        <div className="w-10 h-14 sm:w-12 sm:h-16 bg-primary/20 rounded mx-auto mb-2 flex items-center justify-center overflow-hidden">
                          {tarotImageMap[card.name] ? (
                            <img src={tarotImageMap[card.name]} alt={card.name} className="object-cover w-full h-full" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-primary-foreground">{card.name}</p>
                        <p className="text-xs text-primary-foreground/80">
                          {card.reversed ? "Ngược" : "Thuận"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="p-3 sm:p-4 bg-muted/30">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-3 sm:mb-4 text-xs sm:text-sm">
                    <TabsTrigger value="major" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Major Arcana</span>
                      <span className="sm:hidden">Major</span>
                    </TabsTrigger>
                    <TabsTrigger value="cups" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      Cups
                    </TabsTrigger>
                    <TabsTrigger value="wands" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                      Wands
                    </TabsTrigger>
                    <TabsTrigger value="swords" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                      Swords
                    </TabsTrigger>
                    <TabsTrigger value="pentacles" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Pentacles</span>
                      <span className="sm:hidden">Pent</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="major" className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <h4 className="text-sm sm:text-base font-semibold">Major Arcana - Những lá bài chính (22 lá)</h4>
                    </div>
                    {renderCardGrid(majorArcana)}
                  </TabsContent>

                  <TabsContent value="cups" className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <h4 className="text-sm sm:text-base font-semibold">Cups - Cốc (Tình cảm, Tình yêu) - 14 lá</h4>
                    </div>
                    {renderCardGrid(cups)}
                  </TabsContent>

                  <TabsContent value="wands" className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <h4 className="text-sm sm:text-base font-semibold">Wands - Gậy (Sáng tạo, Năng lượng) - 14 lá</h4>
                    </div>
                    {renderCardGrid(wands)}
                  </TabsContent>

                  <TabsContent value="swords" className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <h4 className="text-sm sm:text-base font-semibold">Swords - Kiếm (Trí tuệ, Thách thức) - 14 lá</h4>
                    </div>
                    {renderCardGrid(swords)}
                  </TabsContent>

                  <TabsContent value="pentacles" className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                      <h4 className="text-sm sm:text-base font-semibold">Pentacles - Đồng xu (Vật chất, Thực tế) - 14 lá</h4>
                    </div>
                    {renderCardGrid(pentacles)}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={interpretCards}
                disabled={isInterpreting}
                className="bg-gradient-gold text-secondary-foreground hover:scale-105 transition-all duration-300 w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
              >
                {isInterpreting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    AI đang giải nghĩa...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Giải Nghĩa Bài
                  </>
                )}
              </Button>
            </div>

            {interpretation && (
              <Card className="p-4 sm:p-6 bg-muted/50">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary">Lời Giải Nghĩa</h3>
                <div className="whitespace-pre-line text-foreground text-sm sm:text-base">
                  {interpretation}
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterpretCards;