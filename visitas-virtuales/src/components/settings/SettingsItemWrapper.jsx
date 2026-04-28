export default function SettingsItemWrapper({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-blue-600 mb-4 ">
        {icon}
        <h2 className="font-bold uppercase tracking-wider text-sm">{title}</h2>
      </div>
    
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        {children}
      </div>
    </div>
  );
}