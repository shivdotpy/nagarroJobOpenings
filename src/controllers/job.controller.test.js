const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const jobModel = require("../models/job.model");
const userModel = require("../models/user.model");
const app = require("../../app");
const should = chai.should();

chai.use(chaiHttp);

describe("Job Test", () => {
  let token = null;
  let jobId = null;
  after(done => {
    jobModel.deleteMany({}, err => {
      done();
    });
  });

  describe("Login User with shiv.sharma@nagaroo.com", () => {
    it("It should login the user", done => {
      let loginBody = {
        email: "shiv.sharma1@nagarro.com",
        password: "Hello@123"
      };

      chai
        .request(app)
        .post("/user/login")
        .send(loginBody)
        .end((err, res) => {
          res.should.have.status(200);
          token = res.body.data.token;
          done();
        });
    });
  });

  describe("Add Job :: /POST /job/add", () => {
    it("It should save the Job", done => {
      let Job = {
        title: "Test Developer",
        description: "Some description",
        jobType: "Permanent",
        location: ["jaipur"],
        mandatorySkills: ["reactjs"],
        goodToHaveSkills: ["veeru"],
        noOfPositions: 1,
        experienceRequired: "1-2 yr"
      };
      chai
        .request(app)
        .post("/job/add")
        .set({
          token: token
        })
        .send(Job)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.should.have
            .property("message")
            .eql("Job saved successfully");
          done();
        });
    });
  });

  describe("Get All Jobs :: GET /job/get", () => {
    it("Should get all jobs", done => {
      chai
        .request(app)
        .get("/job/latest")
        .set({ token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("error");
          done();
        });
    });
  });
});
