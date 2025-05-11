import axios from "axios";
import type { User } from "../../types/User";

const API_URL = "http://localhost:3000/users";

export const loginRequest = async (email: string, password: string) => {
  try {
    const response = await axios.get(
      `${API_URL}?email=${email}&password=${password}`
    );
    console.log(response.data, email, password);

    if (response.data.length > 0) {
      return response.data[0];
    } else {
      // Явно выбрасываем ошибку, если пользователь не найден
      throw new Error("Неверный email или пароль");
    }
  } catch (error: any) {
    console.error("API Error in loginRequest:", error);
    throw error; // Перебрасываем ошибку, чтобы ее поймал thunk
  }
};

export const registerRequest = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await axios.post(API_URL, {
    email,
    password,
    balance: 0,
  });
  return response.data;
};
