import {
  createTournamentRecord,
  getTournamentByIdRecord,
  getTournamentsRecord,
} from './tournament.service.js';

export const getTournaments = async (_req, res, next) => {
  try {
    const tournaments = await getTournamentsRecord();
    return res.status(200).json({
      success: true,
      message: 'Torneos obtenidos exitosamente',
      data: tournaments,
    });
  } catch (err) {
    next(err);
  }
};

export const getTournamentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tournament = await getTournamentByIdRecord(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Torneo encontrado exitosamente',
      data: tournament,
    });
  } catch (err) {
    next(err);
  }
};

export const createTournament = async (req, res, next) => {
  try {
    const tournament = await createTournamentRecord(req.body);
    return res.status(201).json({
      success: true,
      message: 'Torneo creado exitosamente',
      data: tournament,
    });
  } catch (err) {
    next(err);
  }
};
