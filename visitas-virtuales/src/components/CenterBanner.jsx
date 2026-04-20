export default function CenterBanner({ centerName }) {
  return (
    <div className="flex justify-center min-h-12 items-center border border-blue-400 bg-blue-400 rounded w-full mb-4">
      <h1 className="w-full p-1 text-white text-center font-semibold">{centerName}</h1>
    </div>
  );
}