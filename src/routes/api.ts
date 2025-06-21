import express from "express";
import dummyController from "../controllers/dummy.Controller";

const router = express.Router();

router.get("/dummy", dummyController.dummy);

export default router;
