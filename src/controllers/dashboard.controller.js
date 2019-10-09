const jobModel = require("../models/job.model");
/**
 * @swagger
 * definitions:
 *   Dashboard:
 *     type: object
 *     properties:
 *       file:
 *         type: string
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Dashboard Details
 *         schema:
 *           $ref: '#/definitions/Dashboard'
 */
module.exports.getOverview = async (req, res) => {
  const jobs = await jobModel.find({});

  res.send({ numberOfJobs: jobs.length });
};
