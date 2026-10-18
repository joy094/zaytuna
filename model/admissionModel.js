import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicationId: { type: String, unique: true },

    // Step 1: Child
    childInfo: {
      fullName: { type: String, required: true },
      dob: { type: Date, required: true },
      gender: { type: String, required: true },
      classSought: { type: String, required: true },
      currentSchool: { type: String },
      quranLevel: { type: String, required: true },
      supportNeeded: { type: String },
    },

    // Step 2: Family
    familyInfo: {
      fatherName: { type: String, required: true },
      fatherOccupation: { type: String, required: true },
      motherName: { type: String, required: true },
      motherOccupation: { type: String, required: true },
      livesWith: { type: String, required: true },
      primaryMobile: { type: String, required: true },
      email: { type: String },
      areaOfResidence: { type: String, required: true },
      reference: { type: String },
    },

    // Step 3: Deen
    deenInfo: {
      fatherPrayer: String,
      motherPrayer: String,
      quranRecitation: String,
      fastingAndZakat: String,
      islamicDress: String,
      islamicLearning: String,
    },

    // Step 4: Home
    homeInfo: {
      incomeSource: String,
      workDescription: String,
      ribaOrProhibited: String,
      television: String,
      music: String,
      purdah: String,
      mealsTogether: String,
    },

    // Step 5: Habits
    habitsInfo: {
      screenTime: String,
      ownDevice: String,
      videoGames: String,
      watchTV: String,
      conduct: {
        obeysParents: String,
        tantrums: String,
        badWords: String,
        sharesKindly: String,
        showsInterestInDeen: String,
      },
      bedtime: String,
    },

    // Step 6: Commitment
    commitmentInfo: {
      mainHope: String,
      parentGoOverQuran: String,
      agreedToRules: { type: Boolean, default: false },
      familyDescription: String,
      guardianSignature: { type: String, required: true },
    },

    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Invite to Interview", "Hold", "Cancelled", "Accepted"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
