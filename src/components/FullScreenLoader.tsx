export default function FullscreenLoader() {
   return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
   );
}
