import { useState, useMemo, useEffect } from "react";
import testClients from "../assets/jsonData/testClients.json";

const cleanClientName = async (fullName) => {
  const res = await fetch("http://localhost:8000/clean-name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: fullName }),
  });
  const data = await res.json();
  return data; // data.gender -> "М" | "Ж" | "НД"
};

const CANCEL_REASONS = [
  "Клиент предупредил заранее",
  "Клиент не пришёл",
  "Мастер заболел",
  "Перенос на другую дату",
];

function AdminPage() {
  const [appointments, setAppointments] = useState(testClients);
  const [filterClient, setFilterClient] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // состояние для хранения конвертированных валют
  const [euroAmount, setEuroAmount] = useState(null);
  const [usdAmount, setUsdAmount] = useState(null);
  const [ratesLoaded, setRatesLoaded] = useState(false);

  // состояние полов клиентов: { [id]: "М" | "Ж" | "НД" }
  const [genders, setGenders] = useState({});
  const [loadingGenders, setLoadingGenders] = useState(false);

  // состояние модалки переноса
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState("");

  // состояние модалки отмены
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchClient = filterClient
        ? item.clientName.toLowerCase().includes(filterClient.toLowerCase())
        : true;

      const matchDate = filterDate ? item.time.slice(0, 10) === filterDate : true;

      return matchClient && matchDate;
    });
  }, [appointments, filterClient, filterDate]);

  const totalAmountForDay = useMemo(() => {
    return filteredAppointments.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredAppointments]);

  // Эффект для конвертации валюты при изменении totalAmountForDay
  useEffect(() => {
    const convertCurrency = () => {
      if (typeof window.fx !== "undefined" && window.fx.rates) {
        try {
          const eur = window.fx.convert(totalAmountForDay, { from: "RUB", to: "EUR" });
          const usd = window.fx.convert(totalAmountForDay, { from: "RUB", to: "USD" });

          setEuroAmount(eur);
          setUsdAmount(usd);
          setRatesLoaded(true);
        } catch (error) {
          console.error("Ошибка конвертации:", error);
          setRatesLoaded(false);
        }
      } else {
        setTimeout(convertCurrency, 500);
      }
    };

    convertCurrency();
  }, [totalAmountForDay]);

  // Эффект: подгрузка полов для отфильтрованных клиентов
  useEffect(() => {
    const loadGenders = async () => {
      if (filteredAppointments.length === 0) return;

      setLoadingGenders(true);
      const updates = {};

      for (const item of filteredAppointments) {
        // если уже есть пол для этого id — пропускаем запрос
        if (genders[item.id]) continue;

        try {
          const data = await cleanClientName(item.clientName);
          updates[item.id] = data.gender || "НД";
        } catch (e) {
          console.error("Ошибка получения пола:", e);
          updates[item.id] = "НД";
        }
      }

      if (Object.keys(updates).length > 0) {
        setGenders((prev) => ({ ...prev, ...updates }));
      }
      setLoadingGenders(false);
    };

    loadGenders();
  }, [filteredAppointments, genders]);

  const getGenderLabel = (g) => {
    if (g === "М") return "Муж";
    if (g === "Ж") return "Жен";
    if (g === "НД") return "Н/д";
    return loadingGenders ? "..." : "";
  };

  // открыть модалку переноса
  const openRescheduleModal = (item) => {
    setRescheduleId(item.id);
    setRescheduleTime(item.time.slice(0, 16));
  };

  const closeRescheduleModal = () => {
    setRescheduleId(null);
    setRescheduleTime("");
  };

  const handleRescheduleSave = () => {
    if (!rescheduleId || !rescheduleTime) return;

    setAppointments((prev) =>
      prev.map((item) =>
        item.id === rescheduleId ? { ...item, time: rescheduleTime } : item
      )
    );

    closeRescheduleModal();
  };

  // открыть модалку отмены
  const openCancelModal = (item) => {
    setCancelId(item.id);
    setCancelReason(CANCEL_REASONS[0]);
  };

  const closeCancelModal = () => {
    setCancelId(null);
  };

  const handleCancelSave = () => {
    if (!cancelId) return;

    setAppointments((prev) => prev.filter((item) => item.id !== cancelId));

    closeCancelModal();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">
          Клиенты и записи на маникюр
        </h1>

        {/* Блок фильтров */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">
                Фильтр по клиенту
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Начните вводить имя"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Фильтр по дате
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="md:text-right">
              <p className="text-sm text-slate-500 mb-1">
                Общая выручка за выбранный день
              </p>
              <p className="text-xl font-semibold">
                {totalAmountForDay.toLocaleString("ru-RU")} ₽
              </p>
              {ratesLoaded && euroAmount !== null && usdAmount !== null && (
                <div className="text-sm text-slate-600 mt-1">
                  <p>≈ {euroAmount.toFixed(2)} €</p>
                  <p>≈ {usdAmount.toFixed(2)} $</p>
                </div>
              )}
              {!ratesLoaded && (
                <p className="text-xs text-slate-400 mt-1">Загрузка курсов...</p>
              )}
            </div>
          </div>
        </div>

        {/* Таблица клиентов/записей */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Список клиентов</h2>

          {filteredAppointments.length === 0 ? (
            <p className="text-sm text-slate-500">
              Записей по текущим фильтрам нет.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-3 py-2">Клиент</th>
                    <th className="text-left px-3 py-2">Пол</th>
                    <th className="text-left px-3 py-2">Услуга</th>
                    <th className="text-left px-3 py-2">Шаблон</th>
                    <th className="text-left px-3 py-2">Время</th>
                    <th className="text-right px-3 py-2">Сумма, ₽</th>
                    <th className="text-right px-3 py-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{item.clientName}</td>
                      <td className="px-3 py-2">
                        {getGenderLabel(genders[item.id])}
                      </td>
                      <td className="px-3 py-2">{item.serviceType}</td>
                      <td className="px-3 py-2">{item.template}</td>
                      <td className="px-3 py-2">
                        {new Date(item.time).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.amount.toLocaleString("ru-RU")}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          onClick={() => openRescheduleModal(item)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Перенести
                        </button>
                        <button
                          onClick={() => openCancelModal(item)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Отменить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadingGenders && (
                <p className="text-xs text-slate-400 mt-2">
                  Определение пола клиентов...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Модалка переноса */}
        {rescheduleId !== null && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Перенос записи</h3>
              <label className="block text-sm font-medium mb-1">
                Новая дата и время
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleRescheduleSave}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модалка отмены */}
        {cancelId !== null && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Отмена записи</h3>
              <p className="text-sm text-slate-600 mb-3">
                Выберите причину отмены. Она будет сохранена в системе (в демо
                просто удаляем запись).
              </p>
              <label className="block text-sm font-medium mb-1">
                Причина отмены
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                {CANCEL_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={handleCancelSave}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Отменить запись
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;