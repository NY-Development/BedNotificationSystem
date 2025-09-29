
import cron from "node-cron";
import Assignment from "../models/Assignment.js";
import Department from "../models/Department.js";

export const startExpiryJob = () => {
  // Runs every midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running assignment expiry job...");

    try {
      const now = new Date();

      // Find all expired but still active assignments
      const expiredAssignments = await Assignment.find({
        isActive: true,
        $or: [
          { deptExpiry: { $lte: now } },
          { wardExpiry: { $lte: now } }
        ]
      });

      for (const assignment of expiredAssignments) {
        const department = await Department.findById(assignment.department);
        if (department) {
          const ward = department.wards.find(w => w.name === assignment.ward);
          if (ward) {
            for (const bedId of assignment.beds) {
              const bed = ward.beds.find(b => String(b.id) === String(bedId));
              if (bed && String(bed.assignedUser) === String(assignment.user)) {
                bed.assignedUser = null; // free bed
              }
            }
            await department.save();
          }
        }

        assignment.isActive = false; // mark inactive
        await assignment.save();
      }

      console.log(`✅ Expired assignments cleaned: ${expiredAssignments.length}`);
    } catch (err) {
      console.error("❌ Error in expiry job:", err.message);
    }
  });
};
