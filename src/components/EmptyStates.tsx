import React from 'react';
import { Search, FolderOpen, TrendingUp, Calendar, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { FadeIn } from './Animations';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'search' | 'folder' | 'chart' | 'calendar' | 'target' | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const IconMap: Record<string, React.ElementType> = {
  search: Search,
  folder: FolderOpen,
  chart: TrendingUp,
  calendar: Calendar,
  target: Target,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'folder',
  action,
  className,
}) => {
  const IconComponent = typeof icon === 'string' ? IconMap[icon] : null;

  return (
    <FadeIn>
      <div
        className={clsx(
          'flex flex-col items-center justify-center py-16 px-6 text-center',
          className
        )}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 bg-muted rounded-full">
            {IconComponent ? (
              <IconComponent className="w-12 h-12 text-muted-foreground opacity-50" />
            ) : (
              icon
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {description}
          </p>
        )}
        {action && <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">{action}</div>}
      </div>
    </FadeIn>
  );
};

export const EmptyTrades: React.FC<{ onAddTrade?: () => void; lang?: string }> = ({ onAddTrade, lang = 'en' }) => {
  return (
    <EmptyState
      icon="search"
      title={lang === 'en' ? 'No trades found' : 'لم يتم العثور على صفقات'}
      description={
        lang === 'en'
          ? 'Get started by adding your first trade to track your performance'
          : 'ابدأ بإضافة صفقتك الأولى لتتبع أدائك'
      }
      action={
        onAddTrade && (
          <button onClick={onAddTrade} className="btn-primary">
            {lang === 'en' ? 'Add First Trade' : 'أضف أول صفقة'}
          </button>
        )
      }
    />
  );
};

export const EmptySessions: React.FC<{ onCreateSession?: () => void; lang?: string }> = ({ onCreateSession, lang = 'en' }) => {
  return (
    <EmptyState
      icon="calendar"
      title={lang === 'en' ? 'No sessions yet' : 'لا توجد جلسات بعد'}
      description={
        lang === 'en'
          ? 'Create your first trading session to start logging trades'
          : 'أنشئ أول جلسة تداول لبدء تسجيل الصفقات'
      }
      action={
        onCreateSession && (
          <button onClick={onCreateSession} className="btn-primary">
            {lang === 'en' ? 'Create Session' : 'إنشاء جلسة'}
          </button>
        )
      }
    />
  );
};

export const EmptyStrategies: React.FC<{ onAddStrategy?: () => void; lang?: string }> = ({ onAddStrategy, lang = 'en' }) => {
  return (
    <EmptyState
      icon="target"
      title={lang === 'en' ? 'No strategies defined' : 'لا توجد استراتيجيات'}
      description={
        lang === 'en'
          ? 'Define your trading strategies to better analyze your performance'
          : 'حدد استراتيجيات التداول الخاصة بك لتحليل أدائك بشكل أفضل'
      }
      action={
        onAddStrategy && (
          <button onClick={onAddStrategy} className="btn-primary">
            {lang === 'en' ? 'Add Strategy' : 'إضافة استراتيجية'}
          </button>
        )
      }
    />
  );
};

export const EmptyAnalytics: React.FC<{ lang?: string }> = ({ lang = 'en' }) => {
  return (
    <EmptyState
      icon="chart"
      title={lang === 'en' ? 'Not enough data' : 'لا توجد بيانات كافية'}
      description={
        lang === 'en'
          ? 'Add more trades to see meaningful analytics and insights'
          : 'أضف المزيد من الصفقات لرؤية تحليلات ورؤى ذات معنى'
      }
    />
  );
};
