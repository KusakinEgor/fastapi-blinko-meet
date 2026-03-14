import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_room():
    payload = {"name": "My secret room"}
    response = client.post("/rooms/", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == payload["name"]
    assert "id" in data
    assert "slug" in data

def test_join_room_success():
    slug = "cool-room"
    response = client.post(f"/rooms/{slug}/join")

    data = response.json()
    assert response.status_code == 200
    assert data["room_slug"] == slug
    assert "session_token" in data

def test_join_room_not_found():
    response = client.post("/rooms/not-found/join")

    assert response.status_code == 404
    assert response.json()["detail"] == "Room not found"

def test_get_participants():
    slug = "any-room"
    response = client.get(f"/rooms/{slug}/participants")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_update_settings_error():
    response = client.patch("/rooms/some-slug", json={})

    assert response.status_code == 400
    assert response.json()["detail"] == "No settings provided"
