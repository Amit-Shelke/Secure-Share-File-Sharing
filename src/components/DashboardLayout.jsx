import Sidebar from './Sidebar';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gradient-main flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0 min-h-screen overflow-auto">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          {title && (
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6">{title}</h1>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
