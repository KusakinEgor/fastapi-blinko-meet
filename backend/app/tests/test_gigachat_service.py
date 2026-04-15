import pytest
import time
from unittest.mock import AsyncMock, patch
from app.services.gigachat import GigaChatService

@pytest.fixture
async def giga_service():
    service = GigaChatService()
    yield service
    await service.close()

@pytest.mark.asyncio
async def test_get_token_success(giga_service):
    mock_response = {
            "access_token": "test_token_123",
            "expires_in": 1800
    }

    with patch.object(giga_service._client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        token = await giga_service._get_token()

        assert token == "test_token_123"
        assert giga_service._access_token == "test_token_123"
        assert giga_service._expires_at > time.time()

@pytest.mark.asyncio
async def test_ensure_token_uses_cache(giga_service):
    giga_service._access_token = "cached_token"
    giga_service._expires_at = time.time() + 1000

    with patch.object(giga_service, "_get_token", new_callable=AsyncMock) as mock_get_token:
        token = await giga_service._ensure_token()

        assert token == "cached_token"
        mock_get_token.assert_not_called()

@pytest.mark.asyncio
async def test_send_message_success(giga_service):
    giga_service._access_token = "active_token"
    giga_service._expires_at = time.time() + 1000

    mock_chat_response = {
            "choices": [
                {"message": {"content": "Привет! Я нейросеть."}}
            ]
    }

    with patch.object(giga_service._client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_chat_response

        result = await giga_service.send_message("Привет")

        assert result == "Привет! Я нейрость."

        args, kwargs = mock_post.call_args

        assert kwargs["headers"]["Authorization"] == "Bearer active_token"

@pytest.mark.asyncio
async def test_token_error_raises_exception(giga_service):
    with patch.object(giga_service._client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"error": "wrong_scope"}

        with pytest.raises(ValueError, match="GigaChat API did not return an access token"):
            await giga_service._get_token()
