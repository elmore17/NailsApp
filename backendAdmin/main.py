from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dadata import Dadata
from typing import Optional

TOKEN = "fd8c4afe4659dc8d14e65731d8d81d40afe0ce08"
SECRET = "616e7fed3583e7206eb3b4f5afea28598eb4afc0"

dadata = Dadata(TOKEN, SECRET)
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # важно: разрешаем OPTIONS
    allow_headers=["*"],
)


class NameRequest(BaseModel):
    full_name: str  # ФИО из таблицы клиента


class NameResponse(BaseModel):
    source: str
    result: str
    surname: Optional[str] = None
    name: Optional[str] = None
    patronymic: Optional[str] = None
    gender: Optional[str] = None  # "М", "Ж" или "НД"
    qc: Optional[int] = None


@app.post("/clean-name", response_model=NameResponse)
def clean_name(payload: NameRequest):
    result = dadata.clean("name", payload.full_name)

    return {
        "source": result.get("source"),
        "result": result.get("result"),
        "surname": result.get("surname"),
        "name": result.get("name"),
        "patronymic": result.get("patronymic"),
        "gender": result.get("gender"),
        "qc": result.get("qc"),
    }
    
#uvicorn main:app --reload