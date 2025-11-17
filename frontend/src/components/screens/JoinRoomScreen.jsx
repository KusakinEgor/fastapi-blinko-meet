import { useState } from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function JoinRoomScreen({ onBack }) {
  const [roomId, setRoomId] = useState("");

  return (
    <ScreenWrapper>
      <h2 className="text-3xl font-semibold mb-8 text-center">Вход в комнату</h2>

      <Input
        placeholder="ID комнаты"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <Button className="mt-4" variant="primary">Войти</Button>
      <Button className="mt-4 text-sm" variant="secondary" onClick={onBack}>
        Назад
      </Button>
    </ScreenWrapper>
  );
}
