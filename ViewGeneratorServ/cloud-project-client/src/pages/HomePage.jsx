import React, { useState, useEffect } from 'react';
import { Menu, Home, Compass, PlaySquare, Clock, ThumbsUp, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/SideBar';
 
const YoutubeHomepage = () => {
  const navigate = useNavigate();
  

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoData, setVideoData] = useState([]);

  const navigationItems = [
    { icon: Home, label: "Home" },
    { icon: Compass, label: "Explore" },
    { icon: PlaySquare, label: "Subscriptions" },
    { icon: Clock, label: "History" },
    { icon: ThumbsUp, label: "Liked Videos" },
  ];

  const handleVideoClick = (name) => {


    const [folderName, videoName] = name.split('/image/')
    console.log(folderName, "hello " , videoName);

    navigate('/stream', { state: { videoName: videoName, folderName: folderName } });
  };

  useEffect(() => {

    let uploadStatus = (localStorage.getItem('uploadStatus'));
    uploadStatus = JSON.parse(uploadStatus);
    console.log(uploadStatus.message);
    const statusElement = document.querySelector('.upload-status').textContent = uploadStatus.message; // Create an element with this class on the homepage
    
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8800/all-files', {
          method: 'GET',
          headers: {
            'auth_token': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        setVideoData(data.objects);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideos();
  }, [null]);

  return (
    <div className=''>
      


      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-400 to-teal-500 h-16  top-0 left-0 right-0 shadow-lg z-10 flex items-center px-6 ">
  <div className="">
    <Video className="text-black" style={{ paddingLeft: '12px' }}  size={70} />
    <label className="ml-2 font-semibold fs-2 " style={{ gap: '80px' }}>ViewTube</label>
  </div>
</nav>



   
      {/* Sidebar */}

      <Sidebar />
      
   



      <div className="flex pt-16 min-h-screen">
        {/* Main Content */}
        <label className="upload-status  d-flex justify-content-center "> Status </label>
        <div className="container mt-4">
          {selectedVideo ? (
            <div className="row">
              <div className="col-12">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="img-fluid rounded"
                />
                <h1 className="mt-3">{selectedVideo.title}</h1>
                <div className="text-muted mb-3">
                  <span>{selectedVideo.channel}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedVideo.views} views</span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="btn btn-outline-primary"
                >
                  Back to Videos
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {videoData.map((video) => (
                <div
                  key={video.name}
                  className="col-12"
                  onClick={() => handleVideoClick(video.name)}
                >
                  <div className="card shadow-sm h-100">
                    <img
                      src={video.url}
                      alt={video.name}
                      className="card-img-top"
                      style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{video.name}</h5>
                      <p className="card-text text-muted">{video.description}</p>
                      <div className="text-muted">
                        <span>{video.views} views</span>
                        <span className="mx-2">•</span>
                        <span>{video.channel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YoutubeHomepage;
