import React, { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const HotelCardMini = ({ data, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (selectedId) {
        onSelect?.(selectedId);
    }
  }, [selectedId]);

  return (
    <div className="relative">
      {/* Контейнер для скролла */}
      <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
        {(data || []).map((item) => (
          <div
            key={item.id}
            className={`min-w-[280px] border rounded-xl p-4 transition-all duration-200 cursor-pointer flex-shrink-0 ${
              selectedId === item.id
                ? 'border-blue-500 bg-blue-100 shadow-md transform'
                : 'border-gray-500 hover:shadow-sm'
            }`}
            onClick={() => setSelectedId(item.id)}
          >
            {/* Заголовок карточки */}
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg truncate mr-2">
                {item.hotel.name}
              </h3>
              <span className="text-yellow-500 flex-shrink-0">
                {'★'.repeat(item.hotel.stars)}
              </span>
            </div>

            {/* Детали комнаты */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Тип:</span>
                <span className="ml-1 truncate">{item.room_type.name}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Номер:</span>
                <span className="ml-1">{item.room_number}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Страна:</span>
                <span className="ml-1 truncate">{item.hotel.destination.name}</span>
              </div>
            </div>

            {/* Цена */}
            <div className="mt-4 flex justify-between items-end">
              <span className="text-gray-500 text-sm">за ночь</span>
              <span className="font-bold text-lg text-blue-600">
                {parseFloat(item.price_per_night).toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₽
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelCardMini;