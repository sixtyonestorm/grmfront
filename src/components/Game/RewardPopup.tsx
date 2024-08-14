import React, { useEffect, useRef } from 'react';
import { animatePopup } from './utils/popupanimations'; // Güncellenmiş yol

interface RewardPopupProps {
  isVisible: boolean;
  onClose: () => void;
  coin: number;
  experience: number;
}

const RewardPopup: React.FC<RewardPopupProps> = ({ isVisible, onClose, coin, experience }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && popupRef.current) {
      animatePopup(popupRef.current);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-gradient-to-br from-green-900 via-green-800 to-black p-4 rounded-lg shadow-lg max-w-xs w-full"
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">Victory Achieved!</h2>
        <p className="text-base text-gray-200 mb-4 text-center">
          Congratulations! You've defeated the boss and earned rewards.
        </p>
        <p className="text-base text-gray-200 mb-4 text-center">
          <span className="font-semibold text-yellow-300 text-lg">{coin}</span> coins!
        </p>
        <p className="text-base text-gray-200 mb-6 text-center">
          <span className="font-semibold text-blue-300 text-lg">{experience}</span> experience points!
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-semibold rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-600 transition duration-300 ease-in-out text-sm"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
}

export default RewardPopup;
