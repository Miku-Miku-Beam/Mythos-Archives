import * as service from "../services/reputationService.js";

export const updateReputation = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { delta } = req.body;

    const user = await service.updateUserReputation(userId, delta);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
