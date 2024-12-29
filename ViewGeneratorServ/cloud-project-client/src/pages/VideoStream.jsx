import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { Video } from 'lucide-react';

const VideoStream = () => {
  const location = useLocation();
  const [videoSrc, setVideoSrc] = useState(null); // URL for video stream
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    duration: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const data = location.state || {};
        const video = data.videoName;
        const folder = data.folderName + '/video';
        console.log(folder);

        const response = await fetch(
          `http://localhost:8800/stream-video/?folderName=${folder}&videoName=${video}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setVideoSrc(response.url);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [location.state]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <nav className="bg-gradient-to-r from-green-400 to-teal-500 h-16 top-0 left-0 right-0 shadow-lg z-10 flex items-center px-6">
          <div className="">
            <Video className="text-black" style={{ paddingLeft: '12px' }} size={70} />
            <label className="ml-2 font-semibold fs-2 " style={{ gap: '80px' }}>
              ViewTube
            </label>
          </div>
        </nav>

      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          marginLeft: '250px', // Increased margin to push content further to the right
        }}
      >
        

        <h2>Video Streamer</h2>
        {videoSrc ? (
          <div>
            <video
              src={videoSrc}
              controls
              autoPlay
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                marginTop: '30px',
                marginBottom: '30px',
                width: '100%',
                maxWidth: '1200px',
              }}
            ></video>
            <div>
              <h3>Metadata</h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Title:</strong> {metaData.title || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Description:</strong> {metaData.description || 'N/A'}
              </div>
              <div>
                <strong>Duration:</strong> {metaData.duration || 'N/A'}
              </div>
            </div>
          </div>
        ) : (
          <p>Video is not available.</p>
        )}
      </div>
    </div>
  );
};

export default VideoStream;
