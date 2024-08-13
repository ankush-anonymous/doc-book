const express = require("express");
const router = express.Router();
const {
  getAllRoles,
  updateRoles,
  initializeRoles,
  deleteRoles,
} = require("../controllers/RolesAssignmentController"); // Adjust the path
const employeeController = require("../controllers/EmployeeController");

// Define routes
router.get("/employees", employeeController.getAllEmps);
router.get("/employee/:id", employeeController.getSingleEmp);
router.delete("/employee/:id", employeeController.deleteEmp);
router.patch("/employee/:id", employeeController.updateEmp);
router.get("/doctor-detail", employeeController.fetchAllDoctors);

router.get("/roles", getAllRoles);
router.post("/initialize-roles", initializeRoles);
router.patch("/update-roles", updateRoles);
router.delete("/delete-roles/:phoneNumber", deleteRoles);

module.exports = router;
