import { School } from 'lucide-react';

export default function CenterIndicator({ centerName, size = '' }) {
  return (
    <div className="flex items-center text-slate-700">
      <School className={`${size === 'lg' ? 'w-5.75 h-5.75 mr-1.75' : 'w-5.25 h-5.25 mr-1'}`} />
      <h1 className={`w-full p-1 font-semibold ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        {centerName}
      </h1>
    </div>
  );
}