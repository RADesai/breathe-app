export default function Bar({ title, className }: { title: string, className?: string }) {
  return (
    <div className={`flex justify-center p-2 text-xl font-bold uppercase tracking-widest mb-5 ${className}`}>
      {title}
    </div>
  );
}
