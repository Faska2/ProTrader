import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface DisciplineMetric {
  subject: string;
  score: number; // 0-100
  fullMark: number;
}

interface DisciplineRadarChartProps {
  data: DisciplineMetric[];
  average: number;
}

const defaultData: DisciplineMetric[] = [
  { subject: 'Plan', score: 85, fullMark: 100 },
  { subject: 'Risk', score: 72, fullMark: 100 },
  { subject: 'Mindset', score: 90, fullMark: 100 },
  { subject: 'Strategy', score: 68, fullMark: 100 },
  { subject: 'Journal', score: 95, fullMark: 100 },
];

export const DisciplineRadarChart: React.FC<DisciplineRadarChartProps> = ({
  data = defaultData,
  average,
}) => {
  const getStatusColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green - Excellent
    if (score >= 60) return '#F59E0B'; // Yellow - Good
    return '#EF4444'; // Red - Needs Work
  };

  const statusColor = getStatusColor(average);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Discipline Profile
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your trading behavior patterns
          </p>
        </div>
        <div className="text-right">
          <span 
            className="text-3xl font-bold"
            style={{ color: statusColor }}
          >
            {average}
          </span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: '#6B7280',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Discipline"
              dataKey="score"
              stroke={statusColor}
              strokeWidth={3}
              fill={statusColor}
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.subject} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor(item.score) }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.subject}
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white ml-auto">
              {item.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisciplineRadarChart;
