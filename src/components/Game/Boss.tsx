import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { animateBossClick } from './utils/bossanimations';
import HealthBar from './HealthBar';
import RewardPopup from './RewardPopup';
import usePortalAnimation from './utils/portalAnimation';

interface BossData {
  _id: string;
  spid: number;
  name: string;
  health: number;
  imageSrc: string;
  coinAmount: number;
  experienceAmount: number;
}

const Boss: React.FC = () => {
  const [bossData, setBossData] = useState<BossData | null>(null);
  const [currentHealth, setCurrentHealth] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [rewardData, setRewardData] = useState({ coin: 0, experience: 0 });
  const [userId, setUserId] = useState<number | null>(null);
  const [userAttackPower, setUserAttackPower] = useState<number>(0);

  const {
    outerCircleRef,
    middleCircleRef,
    innerCircleRef,
    centerLightRef
  } = usePortalAnimation();

  useEffect(() => {
    // Fetch a random boss from the API
    const fetchRandomBoss = async () => {
      try {
        const response = await axios.get('https://greserver-b4a1eced30d9.herokuapp.com/api/bosses');
        const bosses: BossData[] = response.data;
        if (bosses.length > 0) {
          const randomIndex = Math.floor(Math.random() * bosses.length);
          const selectedBoss = bosses[randomIndex];
          setBossData(selectedBoss);
          setCurrentHealth(selectedBoss.health);
        }
      } catch (error) {
        console.error('Error fetching bosses:', error);
      }
    };

    fetchRandomBoss();
  }, []);

  useEffect(() => {
    // Fetch Telegram user ID
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
    if (telegramUser) {
      setUserId(telegramUser.id);
    }
  }, []);

  useEffect(() => {
    // Fetch user data and attack power once
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userResponse = await axios.get(`https://greserver-b4a1eced30d9.herokuapp.com/api/user/${userId}`);
          const userData = userResponse.data;
          setUserAttackPower(userData.attack_power);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (bossData && currentHealth <= 0) {
      handleBossDeath();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHealth, bossData]);

  const handleClick = async () => {
    if (currentHealth > 0 && bossData && userId) {
      try {
        // Calculate damage based on user's attack_power
        setCurrentHealth(prevHealth => {
          const newHealth = prevHealth - userAttackPower;
          if (newHealth <= 0) {
            setCurrentHealth(0);
            setRewardData({
              coin: bossData.coinAmount,
              experience: bossData.experienceAmount,
            });
            setIsPopupVisible(true);
          }
          return newHealth;
        });

        const bossElement = document.querySelector('.boss-image') as HTMLElement;
        if (bossElement) {
          animateBossClick(bossElement);
        }
      } catch (error) {
        console.error('Error handling click:', error);
      }
    }
  };

  const handleBossDeath = async () => {
    try {
      if (userId) {
        // Kullanıcının güncel verilerini tekrar al
        const userResponse = await axios.get(`https://greserver-b4a1eced30d9.herokuapp.com/api/user/${userId}`);
        const userData = userResponse.data;

        // Eğer attack_power değişmişse, yeni değeri güncelle
        if (userData.attack_power !== userAttackPower) {
          console.warn('Attack power has changed. Updating...');
          setUserAttackPower(userData.attack_power);
        }

        // Update user data with the rewards
        await axios.put(`https://greserver-b4a1eced30d9.herokuapp.com/api/user/${userId}`, {
          mined_boss_coin: userData.mined_boss_coin + (bossData?.coinAmount || 0),
          total_exp: userData.total_exp + (bossData?.experienceAmount || 0)
        });

        // Yeni bir rastgele boss al
        const response = await axios.get('https://greserver-b4a1eced30d9.herokuapp.com/api/bosses');
        const bosses: BossData[] = response.data;
        if (bosses.length > 0) {
          const randomIndex = Math.floor(Math.random() * bosses.length);
          const selectedBoss = bosses[randomIndex];
          setBossData(selectedBoss);
          setCurrentHealth(selectedBoss.health);
        }
      }
    } catch (error) {
      console.error('Error handling boss death or fetching new boss:', error);
    }
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="relative flex flex-col items-center p-4">
      {bossData && (
        <>
          <h2 className="text-xl font-semibold mb-2 text-white">
            {bossData.name}
          </h2>
          <HealthBar hp={currentHealth} maxHp={bossData.health} />
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
              src={bossData.imageSrc}
              alt={`Boss ${bossData.spid}`}
              width={280}
              height={280}
              className="cursor-pointer boss-image"
              onClick={handleClick}
            />
          </div>

          <RewardPopup
            isVisible={isPopupVisible}
            onClose={handlePopupClose}
            coin={rewardData.coin}
            experience={rewardData.experience}
          />
        </>
      )}
    </div>
  );
};

export default Boss;
