// src/components/pages/PreAdmissionForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import axios from "axios";
import "./PreAdmissionForm.css";

// Reusable Radio Question Component
const RadioGroup = ({ label, labelBn, name, options, value, onChange }) => (
  <div className="form-group">
    <label>
      {label}
      {labelBn && (
        <span
          style={{
            display: "block",
            color: "#6b7280",
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          {labelBn}
        </span>
      )}
    </label>
    <div className="radio-group">
      {options.map((opt, i) => (
        <label key={i} className="custom-radio">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            required
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default function PreAdmissionForm({ onNavigate }) {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!auth?.user) {
      toast.warning("দয়া করে আগে লগইন করুন!");
      navigate("/login", { state: "/admissions" });
    }
  }, [auth, navigate]);

  const [formData, setFormData] = useState({
    childInfo: {
      fullName: "",
      dob: "",
      gender: "",
      classSought: "",
      currentSchool: "",
      quranLevel: "",
      supportNeeded: "",
    },
    familyInfo: {
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      livesWith: "",
      primaryMobile: "",
      email: "",
      areaOfResidence: "",
      reference: "",
    },
    deenInfo: {
      fatherPrayer: "",
      motherPrayer: "",
      quranRecitation: "",
      fastingAndZakat: "",
      islamicDress: "",
      islamicLearning: "",
    },
    homeInfo: {
      incomeSource: "",
      workDescription: "",
      ribaOrProhibited: "",
      television: "",
      music: "",
      purdah: "",
      mealsTogether: "",
    },
    habitsInfo: {
      screenTime: "",
      ownDevice: "",
      videoGames: "",
      watchTV: "",
      conduct: {
        obeysParents: "",
        tantrums: "",
        badWords: "",
        sharesKindly: "",
        showsInterestInDeen: "",
      },
      bedtime: "",
    },
    commitmentInfo: {
      mainHope: "",
      parentGoOverQuran: "",
      rulesChecked: false,
      familyDescription: "",
      guardianSignature: "",
    },
  });

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleConductChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      habitsInfo: {
        ...prev.habitsInfo,
        conduct: { ...prev.habitsInfo.conduct, [field]: value },
      },
    }));
  };

  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const targetDate = new Date("2027-01-01");
    let age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleNextStep = () => {
    setErrorMsg("");

    if (currentStep === 0) {
      const { dob, classSought, fullName, gender, quranLevel } =
        formData.childInfo;
      if (!fullName || !dob || !gender || !classSought || !quranLevel) {
        return setErrorMsg("Please fill all required fields in Step 1.");
      }

      const ageIn2027 = calculateAge(dob);
      if (classSought === "Play" && ageIn2027 < 4)
        return setErrorMsg("Play group needs minimum 4 years by Jan 1, 2027.");
      if (classSought === "Nursery" && ageIn2027 < 5)
        return setErrorMsg("Nursery needs minimum 5 years by Jan 1, 2027.");
      if (classSought === "KG" && ageIn2027 < 6)
        return setErrorMsg("KG needs minimum 6 years by Jan 1, 2027.");
      if (classSought === "Grade 1" && ageIn2027 < 7)
        return setErrorMsg("Grade 1 needs minimum 7 years by Jan 1, 2027.");
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.commitmentInfo.rulesChecked ||
      !formData.commitmentInfo.guardianSignature
    ) {
      return setErrorMsg(
        "You must agree to the commitments and provide a signature.",
      );
    }

    try {
      const res = await axios.post(
        "/api/v1/admission/submit-application",
        formData,
        {
          headers: {
            Authorization: auth?.token,
          },
        },
      );

      if (res.data.success) {
        toast.success("Application submitted successfully!");
        onNavigate("main");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (!auth?.user) return null;

  const stepsList = ["Child", "Family", "Deen", "Home", "Habits", "Commitment"];

  return (
    <div className="pre-admission-container">
      <div className="steps-indicator">
        {stepsList.map((step, idx) => {
          let stepClass = "step-item";
          if (idx === currentStep) stepClass += " active";
          else if (idx < currentStep) stepClass += " completed";
          return (
            <div key={idx} className={stepClass}>
              {idx + 1}. {step}
            </div>
          );
        })}
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        {/* ================= STEP 1: CHILD ================= */}
        {currentStep === 0 && (
          <fieldset>
            <legend>About your child</legend>
            <p className="legend-bn">সন্তানের তথ্য</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Child's full name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.childInfo.fullName}
                  onChange={(e) =>
                    handleNestedChange("childInfo", "fullName", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Date of birth</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.childInfo.dob}
                  onChange={(e) =>
                    handleNestedChange("childInfo", "dob", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  required
                  value={formData.childInfo.gender}
                  onChange={(e) =>
                    handleNestedChange("childInfo", "gender", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Class sought for 2027</label>
                <select
                  className="form-control"
                  required
                  value={formData.childInfo.classSought}
                  onChange={(e) =>
                    handleNestedChange(
                      "childInfo",
                      "classSought",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select</option>
                  {[
                    "Play",
                    "Nursery",
                    "KG",
                    "Grade 1",
                    "Grade 2",
                    "Tahfiz Wing",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Current school or madrasa</label>
                <input
                  type="text"
                  placeholder="None, if first school"
                  className="form-control"
                  value={formData.childInfo.currentSchool}
                  onChange={(e) =>
                    handleNestedChange(
                      "childInfo",
                      "currentSchool",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Qur'an reading level</label>
                <select
                  className="form-control"
                  required
                  value={formData.childInfo.quranLevel}
                  onChange={(e) =>
                    handleNestedChange(
                      "childInfo",
                      "quranLevel",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select</option>
                  {[
                    "Not started",
                    "Learning letters (Qaida)",
                    "Reading with help",
                    "Fluent Nazera",
                    "Has memorised some surahs",
                    "Has memorised one juz or more",
                  ].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                Does your child need any learning, health or behaviour support?
              </label>
              <textarea
                placeholder="Leave blank if none"
                className="form-control"
                value={formData.childInfo.supportNeeded}
                onChange={(e) =>
                  handleNestedChange(
                    "childInfo",
                    "supportNeeded",
                    e.target.value,
                  )
                }
              ></textarea>
            </div>
          </fieldset>
        )}

        {/* ================= STEP 2: FAMILY ================= */}
        {currentStep === 1 && (
          <fieldset>
            <legend>Family</legend>
            <p className="legend-bn">পরিবার</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Father's name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.familyInfo.fatherName}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "fatherName",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Father's occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Engineer, business"
                  className="form-control"
                  required
                  value={formData.familyInfo.fatherOccupation}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "fatherOccupation",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Mother's name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.familyInfo.motherName}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "motherName",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Mother's occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Homemaker"
                  className="form-control"
                  required
                  value={formData.familyInfo.motherOccupation}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "motherOccupation",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>The child lives with</label>
                <select
                  className="form-control"
                  required
                  value={formData.familyInfo.livesWith}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "livesWith",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select</option>
                  {["Both parents", "Mother", "Father", "Other guardian"].map(
                    (l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Primary mobile</label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  maxLength="11"
                  className="form-control"
                  required
                  value={formData.familyInfo.primaryMobile}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "primaryMobile",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.familyInfo.email}
                  onChange={(e) =>
                    handleNestedChange("familyInfo", "email", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Area of residence</label>
                <input
                  type="text"
                  placeholder="e.g. Mohammadpur"
                  className="form-control"
                  required
                  value={formData.familyInfo.areaOfResidence}
                  onChange={(e) =>
                    handleNestedChange(
                      "familyInfo",
                      "areaOfResidence",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>A reference who knows your family (optional)</label>
              <input
                type="text"
                placeholder="Name and mobile"
                className="form-control"
                value={formData.familyInfo.reference}
                onChange={(e) =>
                  handleNestedChange("familyInfo", "reference", e.target.value)
                }
              />
            </div>
          </fieldset>
        )}

        {/* ================= STEP 3: DEEN ================= */}
        {currentStep === 2 && (
          <fieldset>
            <legend>Deen in the family</legend>
            <p className="legend-bn">পরিবারে দ্বীনি অনুশীলন</p>

            <RadioGroup
              label="Does the father pray the five daily prayers?"
              labelBn="বাবা কি পাঁচ ওয়াক্ত নামাজ পড়েন?"
              name="fatherPrayer"
              options={[
                "All five, mostly in congregation",
                "All five, regularly",
                "Most prayers",
                "Sometimes",
                "Rarely or not at present",
                "Not applicable",
              ]}
              value={formData.deenInfo.fatherPrayer}
              onChange={(e) =>
                handleNestedChange("deenInfo", "fatherPrayer", e.target.value)
              }
            />

            <RadioGroup
              label="Does the mother pray the five daily prayers?"
              labelBn="মা কি পাঁচ ওয়াক্ত নামাজ পড়েন?"
              name="motherPrayer"
              options={[
                "All five, on time",
                "Most prayers",
                "Sometimes",
                "Rarely or not at present",
                "Not applicable",
              ]}
              value={formData.deenInfo.motherPrayer}
              onChange={(e) =>
                handleNestedChange("deenInfo", "motherPrayer", e.target.value)
              }
            />

            <RadioGroup
              label="How often is the Qur'an recited in your home?"
              labelBn="ঘরে কত নিয়মিত কুরআন তিলাওয়াত হয়?"
              name="quranRecitation"
              options={["Daily", "Several times a week", "Weekly", "Rarely"]}
              value={formData.deenInfo.quranRecitation}
              onChange={(e) =>
                handleNestedChange(
                  "deenInfo",
                  "quranRecitation",
                  e.target.value,
                )
              }
            />

            <RadioGroup
              label="Does the family fast in Ramadan and pay zakat where due?"
              labelBn="পরিবার কি রমজানের রোজা রাখে এবং প্রযোজ্য হলে যাকাত দেয়?"
              name="fastingAndZakat"
              options={["Yes, always", "Partly", "No"]}
              value={formData.deenInfo.fastingAndZakat}
              onChange={(e) =>
                handleNestedChange(
                  "deenInfo",
                  "fastingAndZakat",
                  e.target.value,
                )
              }
            />

            <RadioGroup
              label="Does the family follow Islamic dress: hijab for women, modest Sunnah dress for men?"
              labelBn="পরিবার কি ইসলামী পোশাক মেনে চলে: নারীদের হিজাব, পুরুষদের শালীন সুন্নাহ পোশাক?"
              name="islamicDress"
              options={["Fully", "Mostly", "Partly", "Not at present"]}
              value={formData.deenInfo.islamicDress}
              onChange={(e) =>
                handleNestedChange("deenInfo", "islamicDress", e.target.value)
              }
            />

            <RadioGroup
              label="Do the parents take part in Islamic learning (halaqa, ta'lim, classes or regular reading)?"
              labelBn="বাবা-মা কি নিয়মিত দ্বীনি ইলম চর্চা করেন?"
              name="islamicLearning"
              options={["Regularly", "Sometimes", "Rarely"]}
              value={formData.deenInfo.islamicLearning}
              onChange={(e) =>
                handleNestedChange(
                  "deenInfo",
                  "islamicLearning",
                  e.target.value,
                )
              }
            />
          </fieldset>
        )}

        {/* ================= STEP 4: HOME ================= */}
        {currentStep === 3 && (
          <fieldset>
            <legend>Home & livelihood</legend>
            <p className="legend-bn">ঘরের পরিবেশ ও জীবিকা</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Main source of family income</label>
                <select
                  className="form-control"
                  required
                  value={formData.homeInfo.incomeSource}
                  onChange={(e) =>
                    handleNestedChange(
                      "homeInfo",
                      "incomeSource",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select</option>
                  {[
                    "Own business or trade",
                    "Private-sector job",
                    "Government service",
                    "Profession (doctor, engineer, lawyer...)",
                    "Teaching or Islamic work",
                    "Agriculture",
                    "Remittance from abroad",
                    "Other",
                  ].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Describe the work or business</label>
                <input
                  type="text"
                  placeholder="e.g. garment accessories wholesale"
                  className="form-control"
                  required
                  value={formData.homeInfo.workDescription}
                  onChange={(e) =>
                    handleNestedChange(
                      "homeInfo",
                      "workDescription",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            <RadioGroup
              label="Does any family income come from interest (riba) or a business Islam prohibits?"
              labelBn="পরিবারের আয়ের কোনো অংশ কি সুদ বা ইসলামে নিষিদ্ধ কোনো ব্যবসা থেকে আসে?"
              name="ribaOrProhibited"
              options={[
                "No",
                "Not sure; we would like to discuss it",
                "A small part, and we are leaving it",
                "Yes, mainly",
              ]}
              value={formData.homeInfo.ribaOrProhibited}
              onChange={(e) =>
                handleNestedChange(
                  "homeInfo",
                  "ribaOrProhibited",
                  e.target.value,
                )
              }
            />

            <RadioGroup
              label="Is there a television in the home?"
              labelBn="ঘরে কি টেলিভিশন আছে?"
              name="television"
              options={[
                "No",
                "Yes, rarely used and supervised",
                "Yes, used freely",
              ]}
              value={formData.homeInfo.television}
              onChange={(e) =>
                handleNestedChange("homeInfo", "television", e.target.value)
              }
            />

            <RadioGroup
              label="Is music played in the home?"
              labelBn="ঘরে কি গান-বাজনা চলে?"
              name="music"
              options={["No", "Occasionally", "Regularly"]}
              value={formData.homeInfo.music}
              onChange={(e) =>
                handleNestedChange("homeInfo", "music", e.target.value)
              }
            />

            <RadioGroup
              label="Does the household observe purdah with non-mahram relatives and guests?"
              labelBn="পরিবারে কি গায়রে মাহরামের সাথে পর্দা মানা হয়?"
              name="purdah"
              options={["Fully", "Partly", "Not at present"]}
              value={formData.homeInfo.purdah}
              onChange={(e) =>
                handleNestedChange("homeInfo", "purdah", e.target.value)
              }
            />

            <RadioGroup
              label="Does the family pray or eat meals together?"
              labelBn="পরিবার কি একসাথে নামাজ পড়ে বা খাবার খায়?"
              name="mealsTogether"
              options={["Daily", "Sometimes", "Rarely"]}
              value={formData.homeInfo.mealsTogether}
              onChange={(e) =>
                handleNestedChange("homeInfo", "mealsTogether", e.target.value)
              }
            />
          </fieldset>
        )}

        {/* ================= STEP 5: HABITS ================= */}
        {currentStep === 4 && (
          <fieldset>
            <legend>Your child's habits & conduct</legend>
            <p className="legend-bn">সন্তানের অভ্যাস ও আচরণ</p>

            <RadioGroup
              label="Child's total screen time on a typical day"
              labelBn="সাধারণ দিনে সন্তানের মোট স্ক্রিন টাইম কত?"
              name="screenTime"
              options={[
                "None",
                "Under 30 minutes",
                "30-60 minutes",
                "1-2 hours",
                "More than 2 hours",
              ]}
              value={formData.habitsInfo.screenTime}
              onChange={(e) =>
                handleNestedChange("habitsInfo", "screenTime", e.target.value)
              }
            />

            <RadioGroup
              label="Does your child have their own phone or tablet?"
              labelBn="সন্তানের কি নিজস্ব মোবাইল বা ট্যাব আছে?"
              name="ownDevice"
              options={[
                "No",
                "Uses a parent's device under supervision",
                "Yes, own device",
              ]}
              value={formData.habitsInfo.ownDevice}
              onChange={(e) =>
                handleNestedChange("habitsInfo", "ownDevice", e.target.value)
              }
            />

            <RadioGroup
              label="Does your child play video or mobile games?"
              labelBn="সন্তান কি ভিডিও বা মোবাইল গেম খেলে?"
              name="videoGames"
              options={[
                "Never",
                "Occasionally, once a week or less",
                "Several times a week",
                "Daily",
              ]}
              value={formData.habitsInfo.videoGames}
              onChange={(e) =>
                handleNestedChange("habitsInfo", "videoGames", e.target.value)
              }
            />

            <RadioGroup
              label="Does your child watch TV, cartoons or YouTube?"
              labelBn="সন্তান কি টিভি, কার্টুন বা ইউটিউব দেখে?"
              name="watchTV"
              options={[
                "Never",
                "Only selected Islamic or educational content, supervised",
                "Regularly",
                "Daily, often unsupervised",
              ]}
              value={formData.habitsInfo.watchTV}
              onChange={(e) =>
                handleNestedChange("habitsInfo", "watchTV", e.target.value)
              }
            />

            <div className="mt-8 mb-4 border-t pt-4">
              <span
                className="font-bold text-gray-700 uppercase"
                style={{ fontWeight: "bold" }}
              >
                Conduct · আচরণ
              </span>
            </div>

            <RadioGroup
              label="Obeys parents and follows instructions"
              labelBn="বাবা-মায়ের কথা মানে"
              name="obeysParents"
              options={["Often", "Sometimes", "Rarely"]}
              value={formData.habitsInfo.conduct.obeysParents}
              onChange={(e) =>
                handleConductChange("obeysParents", e.target.value)
              }
            />

            <RadioGroup
              label="Has tantrums, anger or stubborn behaviour"
              labelBn="জেদ, রাগ বা কান্নাকাটি করে"
              name="tantrums"
              options={["Often", "Sometimes", "Rarely"]}
              value={formData.habitsInfo.conduct.tantrums}
              onChange={(e) => handleConductChange("tantrums", e.target.value)}
            />

            <RadioGroup
              label="Uses rude or bad words"
              labelBn="খারাপ বা অভদ্র কথা বলে"
              name="badWords"
              options={["Often", "Sometimes", "Rarely"]}
              value={formData.habitsInfo.conduct.badWords}
              onChange={(e) => handleConductChange("badWords", e.target.value)}
            />

            <RadioGroup
              label="Shares and plays kindly with other children"
              labelBn="অন্য শিশুদের সাথে মিলেমিশে খেলে"
              name="sharesKindly"
              options={["Often", "Sometimes", "Rarely"]}
              value={formData.habitsInfo.conduct.sharesKindly}
              onChange={(e) =>
                handleConductChange("sharesKindly", e.target.value)
              }
            />

            <RadioGroup
              label="Shows interest in salah, Qur'an or du'a"
              labelBn="নামাজ, কুরআন বা দোয়ায় আগ্রহ দেখায়"
              name="showsInterestInDeen"
              options={["Often", "Sometimes", "Rarely"]}
              value={formData.habitsInfo.conduct.showsInterestInDeen}
              onChange={(e) =>
                handleConductChange("showsInterestInDeen", e.target.value)
              }
            />

            <RadioGroup
              label="Usual bedtime"
              labelBn="সাধারণত কখন ঘুমায়?"
              name="bedtime"
              options={["Before 10:00 pm", "After 10:00 pm"]}
              value={formData.habitsInfo.bedtime}
              onChange={(e) =>
                handleNestedChange("habitsInfo", "bedtime", e.target.value)
              }
            />
          </fieldset>
        )}

        {/* ================= STEP 6: COMMITMENT ================= */}
        {currentStep === 5 && (
          <fieldset>
            <legend>Commitment</legend>
            <p className="legend-bn">অঙ্গীকার</p>

            <RadioGroup
              label="What is your main hope for your child at Zaytuna?"
              labelBn="যাইতুনায় সন্তানের জন্য আপনার প্রধান প্রত্যাশা কী?"
              name="mainHope"
              options={[
                "A practising Muslim with strong academics",
                "Mainly Islamic knowledge and character",
                "Mainly good academics in a safe environment",
              ]}
              value={formData.commitmentInfo.mainHope}
              onChange={(e) =>
                handleNestedChange("commitmentInfo", "mainHope", e.target.value)
              }
            />

            <RadioGroup
              label="Will a parent go over Qur'an and homework with the child each day?"
              labelBn="বাবা বা মা কি প্রতিদিন সন্তানের কুরআন ও পড়া দেখবেন?"
              name="parentGoOverQuran"
              options={["Yes, daily", "Most days", "Rarely possible"]}
              value={formData.commitmentInfo.parentGoOverQuran}
              onChange={(e) =>
                handleNestedChange(
                  "commitmentInfo",
                  "parentGoOverQuran",
                  e.target.value,
                )
              }
            />

            <div className="form-group mt-6">
              <label>
                Tell us about your family and why you are choosing Zaytuna
                <span
                  className="form-label-bn"
                  style={{
                    display: "block",
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    fontWeight: "400",
                  }}
                >
                  আপনার পরিবার সম্পর্কে এবং কেন যাইতুনা বেছে নিচ্ছেন, লিখুন
                </span>
              </label>
              <textarea
                className="form-control"
                required
                value={formData.commitmentInfo.familyDescription}
                onChange={(e) =>
                  handleNestedChange(
                    "commitmentInfo",
                    "familyDescription",
                    e.target.value,
                  )
                }
              ></textarea>
            </div>

            <div
              className="mt-8 mb-6 p-5 bg-gray-50 border rounded-lg"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <p
                className="font-bold mb-3"
                style={{ fontWeight: "bold", marginBottom: "12px" }}
              >
                If admitted, we commit to the following:
              </p>
              <ul
                className="list-disc pl-5 mb-5 text-sm text-gray-700 space-y-1"
                style={{ marginLeft: "20px", marginBottom: "20px" }}
              >
                <li>
                  Keep our child away from video games and unsupervised screens,
                  following school guidance.
                </li>
                <li>
                  Our child will not have a personal phone or tablet while at
                  Zaytuna.
                </li>
                <li>
                  Attend guardian meetings and the monthly parents' halaqa.
                </li>
                <li>
                  Follow the school's dress code and adab policy, including at
                  school events.
                </li>
                <li>
                  Support the school's discipline and work with teachers on our
                  child's character.
                </li>
              </ul>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  checked={formData.commitmentInfo.rulesChecked}
                  onChange={(e) =>
                    handleNestedChange(
                      "commitmentInfo",
                      "rulesChecked",
                      e.target.checked,
                    )
                  }
                />
                <span
                  className="checkbox-text font-semibold"
                  style={{ fontWeight: "bold" }}
                >
                  The information is true. We understand the committee may
                  verify it through an interview or home visit, and that false
                  information cancels admission.
                </span>
              </label>
            </div>

            <div className="form-group mt-4">
              <label>Guardian's full name as signature</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.commitmentInfo.guardianSignature}
                onChange={(e) =>
                  handleNestedChange(
                    "commitmentInfo",
                    "guardianSignature",
                    e.target.value,
                  )
                }
              />
            </div>
          </fieldset>
        )}

        {/* ================= NAVIGATION BUTTONS ================= */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-form btn-prev"
            onClick={() =>
              currentStep === 0
                ? onNavigate("main")
                : setCurrentStep((prev) => prev - 1)
            }
          >
            <i
              className={`fa-solid ${currentStep === 0 ? "fa-xmark" : "fa-arrow-left"}`}
            ></i>
            {currentStep === 0 ? "Cancel" : "Back"}
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              className="btn-form btn-next"
              onClick={handleNextStep}
            >
              Continue <i className="fa-solid fa-arrow-right"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-form btn-submit"
            >
              Submit Application <i className="fa-solid fa-check"></i>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
