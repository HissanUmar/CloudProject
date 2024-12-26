


<aside 
className={`fixed top-16 bottom-0 left-0 bg-white shadow-lg transition-all duration-300 z-20
  ${isSidebarOpen ? 'w-64' : 'w-16'}`}
>
<nav className="h-full overflow-y-auto">
  {navItems.map((item, index) => (
    <div 
      key={index} 
      className={`flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center px-4'} 
        py-3 hover:bg-gray-100 cursor-pointer group relative`}
    >
      {item.icon}
      {isSidebarOpen ? (
        <span className="ml-4">{item.label}</span>
      ) : (
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm 
          whitespace-nowrap opacity-0 invisible group-hover:opacity-100 
          group-hover:visible transition-all z-30">
          {item.label}
        </div>
      )}
    </div>
  ))}
</nav>
</aside>