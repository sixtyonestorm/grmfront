import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { animateBossClick } from './utils/bossanimations';
import HealthBar from './HealthBar';
import RewardPopup from './RewardPopup';
import usePortalAnimation from './utils/portalAnimation';

interface BossData {
  _id: string;
  name: string;
  health: number;
  imageSrc: string;
  coinAmount: number;
  experienceAmount: number;
}

const Boss: React.FC = () => {
  const [bossDataList, setBossDataList] = useState<BossData[]>([]);
  const [currentBossIndex, setCurrentBossIndex] = useState(0);
  const [currentHealth, setCurrentHealth] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [rewardData, setRewardData] = useState({ damage: 0, coin: 0 });

  const {
    outerCircleRef,
    middleCircleRef,
    innerCircleRef,
    centerLightRef
  } = usePortalAnimation();

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const response = await axios.get('https://greserver-b4a1eced30d9.herokuapp.com/api/bosses'); // Adjust the URL as needed
        setBossDataList(response.data);
        setCurrentHealth(response.data[0]?.health || 0);
      } catch (error) {
        console.error('Error fetching bosses:', error);
      }
    };

    fetchBosses();
  }, []);

  useEffect(() => {
    if (bossDataList.length > 0) {
      setCurrentHealth(bossDataList[currentBossIndex].health);
    }
  }, [currentBossIndex, bossDataList]);

  useEffect(() => {
    if (currentHealth <= 0) {
      handleBossDeath();
    }
  }, [currentHealth]);

  const handleClick = () => {
    if (currentHealth > 0) {
      setCurrentHealth(prevHealth => {
        const newHealth = prevHealth - 10;
        if (newHealth <= 0) {
          setCurrentHealth(0);
          setRewardData({
            damage: bossDataList[currentBossIndex].health,
            coin: bossDataList[currentBossIndex].coinAmount,
          });
          setIsPopupVisible(true);
        }
        return newHealth;
      });

      const bossElement = document.querySelector('.boss-image') as HTMLElement;
      if (bossElement) {
        animateBossClick(bossElement);
      }
    }
  };

  const handleBossDeath = () => {
    setCurrentBossIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % bossDataList.length;
      setCurrentHealth(bossDataList[nextIndex].health);
      return nextIndex;
    });
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="relative flex flex-col items-center p-4">
      {bossDataList.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2 text-white">
            {bossDataList[currentBossIndex].name}
          </h2>
          <HealthBar hp={currentHealth} maxHp={bossDataList[currentBossIndex].health} />
          <div className="relative flex justify-center items-center">
            <div className="absolute flex items-center justify-center">
              {/* Dış Halka */}
              <div ref={outerCircleRef} className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-green-700 via-teal-500 to-green-700 opacity-70 shadow-lg" style={{ zIndex: -1 }}></div>
              {/* Orta Halka */}
              <div ref={middleCircleRef} className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-teal-500 via-lime-400 to-teal-500 opacity-60 shadow-lg" style={{ zIndex: -1 }}></div>
              {/* İç Halka */}
              <div ref={innerCircleRef} className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 opacity-50 shadow-lg" style={{ zIndex: -1 }}></div>
              {/* Merkez Işık */}
              <div ref={centerLightRef} className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 via-green-200 to-yellow-300 opacity-40 shadow-lg" style={{ zIndex: -1 }}></div>
            </div>

            <img
              src={bossDataList[currentBossIndex].imageSrc}
              alt={`Boss ${bossDataList[currentBossIndex]._id}`}
              width={280}
              height={280}
              className="cursor-pointer boss-image"
              onClick={handleClick}
            />
          </div>

          <RewardPopup
            isVisible={isPopupVisible}
            onClose={handlePopupClose}
            damage={rewardData.damage}
            coin={rewardData.coin}
          />
        </>
      )}
    </div>
  );
};

export default Boss;
