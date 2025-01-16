import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login";
    }
    console.log("REJECT =>", error);

    return Promise.reject(error);
  }
);

export const auth = {
  loginOrSignup: async (email: string, password: string) => {
    const { data } = await api.post("/users/login-or-signup", {
      email,
      password,
    });
    // We are only storing token, what about user info on page refresh in our auth context ?
    localStorage.setItem("auth_token", data.token);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },
  logout: () => {
    localStorage.removeItem("auth_token");
  },
};

export const teams = {
  searchTeams: async (search?: string, limit: number = 10) => {
    const { data } = await api.get("/teams", { params: { search, limit } });
    return data.teams;
  },

  createTeam: async (teamData: {
    name: string;
    players: Array<{ name: string; position: string; base_price: number }>;
  }) => {
    const { data } = await api.post("/teams", teamData);
    return data;
  },

  getMyPlayers: async () => {
    const { data } = await api.get("/teams/me/players");
    return data;
  },
};

export const players = {
  getPlayers: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    team?: string;
    min_price?: number;
    max_price?: number;
    position?: string;
    is_listed?: boolean;
  }) => {
    const { data } = await api.get("/players", { params });
    return data;
  },

  listPlayer: async (playerId: string, listing_price: number) => {
    const { data } = await api.post(`/players/${playerId}/list`, {
      listing_price,
    });
    return data;
  },

  unlistPlayer: async (playerId: string) => {
    const { data } = await api.post(`/players/${playerId}/unlist`);
    return data;
  },

  buyPlayer: async (playerId: string) => {
    const { data } = await api.post(`/players/${playerId}/buy`);
    return data;
  },
};

export { api };
