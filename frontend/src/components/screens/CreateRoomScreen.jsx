import ScreenWrapper from "../ui/ScreenWrapper";
import Button from "../ui/Button";
import { useEffect, useState } from "react";

export default function CreateRoomScreen({ onBack }) {
  const [loaded, setLoaded] = useState(false);
  const [maxUsers, setMaxUsers] = useState(15);

  useEffect(() => setLoaded(true), []);

  const increase = () => setMaxUsers((v) => Math.min(v + 1, 999));
  const decrease = () => setMaxUsers((v) => Math.max(v - 1, 1));

  return (
    <ScreenWrapper>
      <div
        className={`
          w-full max-w-xl mx-auto p-10 rounded-[28px]
          bg-white/10 backdrop-blur-2xl border border-white/20
          shadow-[0_0_60px_-10px_rgba(0,0,0,0.7)]
          transition-all duration-700
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        {/* Заголовок */}
        <h2
          className="
            text-center text-4xl font-extrabold mb-4 
            bg-gradient-to-r from-white via-blue-300 to-purple-300
            bg-clip-text text-transparent tracking-wide
          "
        >
          Создать комнату
        </h2>

        {/* Подзаголовок */}
        <p className="text-gray-300 text-center mb-10 leading-relaxed text-[15px]">
          Заполните параметры будущей видеосессии.  
          Всё можно изменить и после создания.
        </p>

        {/* Поля */}
        <div className="flex flex-col gap-6 mb-12">
          {/* Название */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm">Название комнаты</label>
            <input
              type="text"
              placeholder="Совещание отдела"
              className="
                bg-black/30 border border-white/10 rounded-xl
                px-4 py-3.5 text-white placeholder-gray-500/70
                focus:border-blue-400 outline-none transition
              "
            />
          </div>

          {/* Макс участников */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm">Макс. участников</label>

            <div className="relative">
              <input
                type="number"
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                className="
                  w-full bg-black/30 border border-white/10 rounded-xl
                  px-4 py-3.5 pr-14 text-white placeholder-gray-500/70
                  focus:border-blue-400 outline-none transition
                  appearance-none
                "
              />

              {/* Кастомные стрелочки */}
              <div
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  flex flex-col gap-1 select-none
                "
              >
                <button
                  onClick={increase}
                  className="
                    w-6 h-6 flex items-center justify-center rounded-md
                    bg-white/5 border border-white/20
                    hover:bg-white/10 hover:scale-[1.1]
                    active:scale-95 transition
                  "
                >
                  ▲
                </button>

                <button
                  onClick={decrease}
                  className="
                    w-6 h-6 flex items-center justify-center rounded-md
                    bg-white/5 border border-white/20
                    hover:bg-white/10 hover:scale-[1.1]
                    active:scale-95 transition
                  "
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col gap-4">
          <Button
            variant="success"
            className="
              w-full py-3 text-base font-semibold rounded-xl
              shadow-lg hover:scale-[1.03] transition-transform duration-200
            "
          >
            Создать комнату
          </Button>

          <Button
            variant="secondary"
            onClick={onBack}
            className="
              w-full py-2 text-sm
              bg-white/5 border border-white/10
              rounded-xl opacity-80 hover:opacity-100
              hover:scale-[1.02] transition
            "
          >
            Назад
          </Button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
