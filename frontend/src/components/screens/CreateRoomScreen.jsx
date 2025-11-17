import ScreenWrapper from "../ui/ScreenWrapper";
import Button from "../ui/Button";

export default function CreateRoomScreen({ onBack }) {
  return (
    <ScreenWrapper>
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Создать комнату
      </h2>

      <Button variant="success">Создать</Button>
      <Button variant="secondary" onClick={onBack} className="mt-6 text-sm">
        Назад
      </Button>
    </ScreenWrapper>
  );
}
