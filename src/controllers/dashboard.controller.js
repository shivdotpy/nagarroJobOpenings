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
  let frontendCount = 0;
  let backendCount = 0;
  let fullstackCount = 0;
  let otherCount = 0;
  let qaCount = 0;
  let adminCount = 0;
  jobs.forEach(job => {
    if (job.type === "frontend") {
      frontendCount++;
    } else if (job.type === "backend") {
      backendCount++;
    } else if (job.type === "fullstack") {
      fullstackCount++;
    } else if (job.type === "qa") {
      qaCount++;
    } else if (job.type === "admin") {
      adminCount++;
    } else {
      otherCount++;
    }
  });
  res.send({
    numberOfJobs: jobs.length,
    frontendCount,
    backendCount,
    fullstackCount,
    qaCount,
    adminCount,
    otherCount
  });
};
