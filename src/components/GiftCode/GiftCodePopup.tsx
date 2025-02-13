import React, { useState, useRef, useEffect } from 'react';
import { animatePopup } from '../Game/utils/popupanimations'; // Güncellenmiş yol

interface GiftCodePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const GiftCodePopup: React.FC<GiftCodePopupProps> = ({ isVisible, onClose }) => {
  const [code, setCode] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && popupRef.current) {
      animatePopup(popupRef.current);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    // Hediye kodunu işlemek için gerekli işlemler burada yapılabilir
    console.log(`Gift Code Submitted: ${code}`);
    onClose(); // Kod gönderildikten sonra popup'ı kapat
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 bg-black bg-opacity-70">
      <div
        ref={popupRef}
        className="bg-gradient-to-br from-green-900 to-green-700 p-4 rounded-lg shadow-lg w-full max-w-xs border border-yellow-500"
      >
        <h2 className="text-lg font-bold text-yellow-400 mb-2 text-center">Enter Gift Code</h2>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => openLink('https://www.youtube.com/watch?v=frip8Ano1nA')}>
            <img
              src="https://img.youtube.com/vi/frip8Ano1nA/hqdefault.jpg"
              alt="YouTube video preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="text-gray-200 text-xs">
              <h3 className="font-semibold">Video Title 1</h3>
              <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => openLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
              alt="YouTube video preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="text-gray-200 text-xs">
              <h3 className="font-semibold">Video Title 2</h3>
              <p className="text-xs">Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
          </div>

          {/* More video previews can be added here */}
        </div>

        <div className="mb-3">
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter code"
            className="w-full p-2 bg-gray-800 text-gray-200 border border-yellow-500 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
          />
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-yellow-600 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-200 ease-in text-sm"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-1 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200 ease-in text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCodePopup;
