import { useState } from "react";

export default function Auth({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Введите логин и пароль");
      return;
    }

    if (username === "admin" && password === "1234") {
      setError("");
      onLogin();
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F0FC]">
      <div className="relative w-full max-w-md bg-white border border-[#ACCBFA] rounded-2xl shadow-xl p-8 transition-transform transform hover:-translate-y-1">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">ADMIN M&N</h1>
          <p className="text-sm text-[#64748B]">
            Введите ваши учетные данные
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#ACCBFA] bg-[#F8FAFC] 
              text-[#1E293B] placeholder-[#94A3B8]
              focus:outline-none focus:ring-2 focus:ring-[#85B3F7] transition"
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#ACCBFA] bg-[#F8FAFC] 
              text-[#1E293B] placeholder-[#94A3B8]
              focus:outline-none focus:ring-2 focus:ring-[#85B3F7] transition"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#85B3F7] text-white font-semibold hover:bg-[#6FA2F5] 
            transition-transform transform hover:-translate-y-0.5 shadow-md"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
