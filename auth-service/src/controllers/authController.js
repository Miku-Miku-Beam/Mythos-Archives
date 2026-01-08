import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    const status = err?.status || 500;
    const message = err?.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};

export const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.json(token);
  } catch (err) {
    console.error(err);

    const status = err?.status || 500;
    const message = err?.message || "Internal server error";

    res.status(status).json({ error: message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await authService.me(req.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    const status = err?.status || 500;
    const message = err?.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};
