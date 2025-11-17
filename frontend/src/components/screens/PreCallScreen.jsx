import ScreenWrapper from "../ui/ScreenWrapper";
import Button from "../ui/Button";
import Select from "../ui/Select";

export default function PreCallScreen({ onStart }) {
  return (
    <ScreenWrapper>
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Проверка камеры и микрофона
      </h2>

      <div className="w-64 h-48 bg-white/5 border border-white/10 rounded-xl mb-6 flex items-center justify-center text-gray-500">
        Камера превью
      </div>

      <div className="flex flex-col gap-4">
        <Select>
          <option>Выбрать камеру</option>
        </Select>

        <Select>
          <option>Выбрать микрофон</option>
        </Select>

        <Button variant="primary" className="mt-2" onClick={onStart}>
          Начать конференцию
        </Button>
      </div>
    </ScreenWrapper>
  );
}
