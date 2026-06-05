import Tournament from './tournament.model.js';

export const getTournamentsRecord = async () => {
  return await Tournament.find({}).sort({ createdAt: -1 }).lean();
};

export const getTournamentByIdRecord = async (id) => {
  return await Tournament.findById(id).lean();
};

export const createTournamentRecord = async (data) => {
  const tournament = new Tournament(data);
  await tournament.save();
  return tournament;
};
