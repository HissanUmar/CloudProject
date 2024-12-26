import React, { useState } from 'react';
import { Menu, Search, Home, LineChart, Users, Library, History, Video, Clock, ThumbsUp } from 'lucide-react';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const videos = [
    {
      id: 1,
      title: "Making a Delicious Pasta Carbonara",
      channel: "Cooking Master",
      views: "120K views",
      timestamp: "2 days ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    },
    {
      id: 2,
      title: "Web Development Full Course 2024",
      channel: "Tech Academy",
      views: "50K views",
      timestamp: "1 week ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    },
    {
      id: 3,
      title: "Morning Yoga Routine for Beginners",
      channel: "Yoga Life",
      views: "75K views",
      timestamp: "3 days ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    },
    {
      id: 4,
      title: "Understanding React Hooks",
      channel: "JavaScript Pro",
      views: "200K views",
      timestamp: "5 days ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    },
    {
      id: 5,
      title: "Travel Vlog: exploring Japan",
      channel: "Travel With Me",
      views: "150K views",
      timestamp: "1 day ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    },
    {
      id: 6,
      title: "Guitar Lessons for Beginners",
      channel: "Music Master",
      views: "80K views",
      timestamp: "4 days ago",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&s"
    }
  ];

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home" },
    { icon: <LineChart className="h-5 w-5" />, label: "Trending" },
    { icon: <Users className="h-5 w-5" />, label: "Subscriptions" },
    { icon: <Library className="h-5 w-5" />, label: "Library" },
    { icon: <History className="h-5 w-5" />, label: "History" },
    { icon: <Video className="h-5 w-5" />, label: "Your Videos" },
    { icon: <Clock className="h-5 w-5" />, label: "Watch Later" },
    { icon: <ThumbsUp className="h-5 w-5" />, label: "Liked Videos" },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center px-4">
        <Menu 
          className="h-6 w-6 cursor-pointer hover:text-blue-500 transition-colors" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <span className="font-bold text-xl ml-4">VideoStream</span>
        <div className="max-w-2xl w-full mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
   

      {/* Main Content */}
      <main 
        className={`absolute top-16 right-0 bottom-0 transition-all duration-300 overflow-y-auto bg-gray-100
          ${isSidebarOpen ? 'left-64' : 'left-16'}`}
      >
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full object-cover aspect-video"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-gray-600">{video.channel}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>{video.views}</span>
                    <span>•</span>
                    <span>{video.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;