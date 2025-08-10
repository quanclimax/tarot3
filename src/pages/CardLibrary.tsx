import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Link, useLocation } from "react-router-dom";

// Extended tarot cards with categories
const tarotCards = {
  "Major Arcana": [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ],
  "Cups (Cung Bách)": [
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
    "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
    "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups"
  ],
  "Pentacles (Đồng Xu)": [
    "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
    "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
    "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
  ],
  "Swords (Kiếm)": [
    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
    "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
    "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords"
  ],
  "Wands (Gậy)": [
    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
    "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
    "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands"
  ]
};

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

const CardLibrary = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardMeaning, setCardMeaning] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Major Arcana");

  // Mobile tab navigation items
  const mobileNavItems = [
    {
      path: '/',
      label: 'Bốc Bài',
      icon: Sparkles,
      isActive: location.pathname === '/'
    },
    {
      path: '/interpret',
      label: 'Giải Bài',
      icon: BookOpen,
      isActive: location.pathname === '/interpret'
    },
    {
      path: '/cards',
      label: 'Tra Bài',
      icon: BookOpen,
      isActive: location.pathname === '/cards'
    }
  ];

  const filteredCards = tarotCards[selectedCategory as keyof typeof tarotCards].filter(card =>
    card.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCardMeaning = async (card: string) => {
    setSelectedCard(card);
    setCardMeaning("");

    // This would be where you call your AI API
    const prompt = `Bạn là một tarot reader chuyên nghiệp và hãy cho tôi biết ý nghĩa của lá: ${card}`;

    // Mock meaning for now
    setTimeout(() => {
      setCardMeaning(`🔮 **${card}**

**Ý nghĩa chính:**
Lá bài ${card} mang trong mình những thông điệp sâu sắc về ${card.includes('Ace') ? 'khởi đầu mới và tiềm năng' : card.includes('King') ? 'quyền lực và sự trưởng thành' : card.includes('Queen') ? 'trực giác và sự nuôi dưỡng' : 'hành trình và thử thách'}.

**Trong tình yêu:**
${card} thể hiện ${card.includes('Cups') ? 'những cảm xúc sâu sắc và mối quan hệ ý nghĩa' : card.includes('Pentacles') ? 'sự ổn định và cam kết lâu dài' : card.includes('Swords') ? 'những thách thức trong giao tiếp' : 'đam mê và năng lượng mới'}.

**Trong sự nghiệp:**
Lá bài này gợi ý ${card.includes('Pentacles') ? 'cơ hội tài chính và thành công vật chất' : card.includes('Wands') ? 'động lực làm việc và sáng tạo' : card.includes('Swords') ? 'cần suy nghĩ logic và quyết đoán' : 'cần lắng nghe trực giác'}.

**Lời khuyên:**
${card} khuyên bạn nên ${card.includes('Major') ? 'chú ý đến những bài học lớn trong cuộc sống' : 'tập trung vào những chi tiết nhỏ trong cuộc sống hàng ngày'}.

*Lưu ý: Đây là giải nghĩa mẫu. Để có kết quả chính xác, hệ thống cần tích hợp AI.*`);
    }, 1000);

    toast.success(`Đang tải ý nghĩa của ${card}...`);
  };

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
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Thư Viện Lá Bài Tarot</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Khám phá ý nghĩa và biểu tượng của từng lá bài</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Panel - Search and Cards */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search" className="text-base sm:text-lg font-semibold">Tìm kiếm lá bài</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nhập tên lá bài..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(tarotCards).map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`text-xs sm:text-sm ${
                      selectedCategory === category ? "bg-gradient-primary" : ""
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-3">
                {filteredCards.map((card) => (
                  <Card
                    key={card}
                    className={`p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-mystical ${
                      selectedCard === card ? 'bg-gradient-mystical shadow-mystical' : 'hover:border-primary/50'
                    }`}
                    onClick={() => getCardMeaning(card)}
                  >
                    <div className="text-center">
                      <div className="w-14 h-20 sm:w-16 sm:h-24 bg-primary/20 rounded-lg mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                        {tarotImageMap[card] ? (
                          <img src={tarotImageMap[card]} alt={card} className="h-full w-full object-contain" />
                        ) : (
                          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        )}
                      </div>
                      <h3 className={`text-xs sm:text-sm font-medium ${
                        selectedCard === card ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {card}
                      </h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Panel - Card Meaning */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6 bg-muted/30 min-h-[300px] sm:min-h-[400px]">
                {selectedCard ? (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary text-center">
                      {selectedCard}
                    </h3>
                    <div className="w-20 h-28 sm:w-24 sm:h-36 bg-gradient-mystical rounded-lg mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-mystical">
                      {tarotImageMap[selectedCard] ? (
                        <img src={tarotImageMap[selectedCard]} alt={selectedCard} className="h-full w-full object-contain" />
                      ) : (
                        <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
                      )}
                    </div>
                    {cardMeaning ? (
                      <div className="whitespace-pre-line text-foreground text-sm sm:text-base">
                        {cardMeaning}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-sm sm:text-base">Đang tải ý nghĩa...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                    <div>
                      <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">Chọn một lá bài để xem ý nghĩa</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardLibrary;