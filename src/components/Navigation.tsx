import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Sparkles, BookOpen, Eye } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Bốc Bài',
      icon: Eye,
      description: 'Để số phận chọn bài cho bạn'
    },
    {
      path: '/interpret',
      label: 'Giải Bài',
      icon: Sparkles,
      description: 'Giải nghĩa bài bạn đã chọn'
    },
    {
      path: '/cards',
      label: 'Tra Bài',
      icon: BookOpen,
      description: 'Tìm hiểu ý nghĩa từng lá bài'
    }
  ];

  return (
    <nav className="mb-6 sm:mb-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-mystical bg-clip-text text-transparent mb-2">
          ✨ Mystical Tarot ✨
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Khám phá bí ẩn qua lá bài tarot</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Card className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-mystical cursor-pointer ${
                isActive 
                  ? 'bg-gradient-primary border-primary shadow-mystical' 
                  : 'hover:border-primary/50'
              }`}>
                <div className="text-center">
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 ${
                    isActive ? 'text-primary-foreground' : 'text-primary'
                  }`} />
                  <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
                    isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {item.label}
                  </h3>
                  <p className={`text-xs sm:text-sm ${
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;