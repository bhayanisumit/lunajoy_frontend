import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import options from "./options.json";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddPatient() {
  const [mood_rating, setMood_Rating] = useState("");
  const [anxiety, setAnxiety] = useState("");
  const [sleep_quality, setSleep_Quality] = useState("");
  const [sleep_disturbance, setSleep_Disturbance] = useState("");
  const [physical_activity_type, setPhysical_Activity_Type] = useState("");
  const [social_interaction, setSocial_Interaction] = useState("");
  const [stress_level, setStress_Level] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();
  
  const [duration, setDuration] = useState("");
  const [sleephour, setSleepHour] = useState("");
  const [errors, setErrors] = useState({});

  const url = process.env.REACT_APP_API_URL;



 

  const handleDurationChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const hours = value.slice(0, 2);
    const minutes = value.slice(2, 4);

    if (hours.length === 2 && parseInt(hours, 10) > 23) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        duration: "Invalid hour format. Hours should be between 00 and 23.",
      }));
      setDuration(hours);
      return;
    } else {
      setErrors((prevErrors) => {
        const { duration, ...rest } = prevErrors;
        return rest;
      });
    }

    if (minutes.length === 2 && parseInt(minutes, 10) > 59) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        duration: "Invalid minute format. Minutes should be between 00 and 59.",
      }));
      setDuration(hours + minutes.slice(0, 1));
      return;
    } else {
      setErrors((prevErrors) => {
        const { duration, ...rest } = prevErrors;
        return rest;
      });
    }
    const formattedDuration = hours + (minutes.length > 0 ? ":" + minutes : "");
    setDuration(formattedDuration);
  };
  const handleSleepHourChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const hours = value.slice(0, 2);
    const minutes = value.slice(2, 4);

    if (hours.length === 2 && parseInt(hours, 10) > 23) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sleephour: "Invalid hour format. Hours should be between 00 and 23.",
      }));
      setSleepHour(hours);
      return;
    } else {
      setErrors((prevErrors) => {
        const { sleephour, ...rest } = prevErrors;
        return rest;
      });
    }

    if (minutes.length === 2 && parseInt(minutes, 10) > 59) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sleephour:
          "Invalid minute format. Minutes should be between 00 and 59.",
      }));
      setSleepHour(hours + minutes.slice(0, 1));
      return;
    } else {
      setErrors((prevErrors) => {
        const { sleephour, ...rest } = prevErrors;
        return rest;
      });
    }
    const formattedDuration = hours + (minutes.length > 0 ? ":" + minutes : "");
    setSleepHour(formattedDuration);
  };

  const handleSymptomsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSymptoms([...symptoms, value]);
    } else {
      setSymptoms(symptoms.filter((symptom) => symptom !== value));
    }
  };

  const validateForm = () => {
    let formErrors = {};

    // if (!mood_rating) formErrors.mood_rating = "Mood Rating is required *";
    if (!anxiety) formErrors.anxiety = "Anxiety Level is required *";
    if (!sleep_quality)
      formErrors.sleep_quality = "Sleep Quality is required *";
    if (!sleep_disturbance)
      formErrors.sleep_disturbance = "Sleep Disturbance is required *";
    if (!social_interaction)
      formErrors.social_interaction = "Social Interaction is required *";
    if (!stress_level) formErrors.stress_level = "Stress Level is required *";
    if (!physical_activity_type)
      formErrors.physical_activity_type =
        "Physical Activity Type is required *";
    if (symptoms.length === 0)
      formErrors.symptoms = "At least one symptom must be selected *";
    if (!sleephour) formErrors.sleephour = "Sleep hour is required *";
    if (
      sleephour.length !== 4 &&
      parseInt(sleephour.slice(0, 2), 10) > 23 &&
      parseInt(sleephour.slice(2, 4), 10) > 59
    ) {
      formErrors.sleephour =
        "Invalid time format. Hours should be 00-23 and minutes should be 00-59.";
    }
    if (!duration) formErrors.duration = "Duration is required *";
    if (
      duration.length !== 4 &&
      parseInt(duration.slice(0, 2), 10) > 23 &&
      parseInt(duration.slice(2, 4), 10) > 59
    ) {
      formErrors.duration =
        "Invalid time format. Hours should be 00-23 and minutes should be 00-59.";
    }
    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    let data = {
      mood_rating,
      anxiety,
      sleep_hours: parseFloat(sleephour),
      sleep_quality,
      sleep_disturbance,
      physical_activity_type,
      physical_activity_duration: parseFloat(duration),
      social_interaction,
      stress_level,
      symptoms: symptoms.length > 0 ? symptoms.join(", ") : "None",
    };
    // console.log("Submitting data:", data);//success

    try {
      let response = await axios.post(`${url}/log/add-log`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("auth")}`,
        },
        withCredentials: true,
      });

      // Axios automatically parses the JSON response
      let result = response.data;
      if (response.status === 201 && result.success === true) {
        //console.log("Data inserted successfully"); //success
        toast.success("Data inserted successfully");
        setTimeout(() => navigate("/dashboard"), 100);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    }
  }
 
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container">
        <div className="row apppatient-card">
          <div className="col-lg-9 offset-2 mt-5 ">
            <div className="card add-card mb-5">
              <div className="d-flex justify-content-center card-header" id="addheader">
                <h4>Add Log </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Sleep */}
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        htmlFor="mood_rating"
                        className="form-label fw-semibold d-flex"
                      >
                        Mood Ratings
                      </label>
                      <select
                      
                        id="mood_rating"
                        className="form-select"
                        value={mood_rating}
                        onChange={(e) => setMood_Rating(e.target.value)}
                      >
                        <option value="">Select Mood Rating</option>
                        {options.mood_rating.rating.map((rating, index) => (
                          <option key={index} value={rating}>
                            {options.mood_rating.emoji[index]} {rating}
                          </option>
                        ))}
                      </select>
                      {errors.mood_rating && (
                        <div className="text-danger text-start">
                          {errors.mood_rating}
                        </div>
                      )}
                    </div>
                    <div className="mb-3 col-md-6 ">
                      <label
                        htmlFor="anxiety"
                        className="form-label fw-semibold d-flex"
                      >
                        Anxiety Level
                      </label>
                      <select
                      
                        id="anxiety"
                        className="form-select"
                        value={anxiety}
                        onChange={(e) => setAnxiety(e.target.value)}
                      >
                        <option value="">Select Anxiety Level</option>
                        {options.anxiety.map((level, index) => (
                          <option key={index} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.anxiety && (
                        <div className="text-danger text-start">
                          {errors.anxiety}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="card sleep-card">
                        <div className="card-header d-flex">
                          <h5>Sleep</h5>
                        </div>
                        <div className="card-body">
                          <div>
                            <label
                              htmlFor="sleep_hours"
                              className="form-label fw-semibold d-flex"
                            >
                              Hours of Sleep
                            </label>
                            <input
                              type="text"
                              className="w-100 form-control"
                              id="sleep"
                              value={sleephour}
                              onChange={handleSleepHourChange}
                              placeholder="HH:MM"
                              required
                            />
                            {errors.sleephour && (
                              <div className="text-danger text-start px-2">
                                {errors.sleephour}
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <label
                              htmlFor="sleep_quality"
                              className="form-label fw-semibold d-flex"
                            >
                              Quality of Sleep
                            </label>
                            <select
                            
                              id="sleep_quality"
                              className="form-select"
                              value={sleep_quality}
                              onChange={(e) => setSleep_Quality(e.target.value)}
                            >
                              <option value="">Select Quality of Sleep</option>
                              {options.sleep_quality.map((quality, index) => (
                                <option key={index} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                            {errors.sleep_quality && (
                              <div className="text-danger text-start">
                                {errors.sleep_quality}
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <label
                              htmlFor="sleep_disturbance"
                              className="form-label fw-semibold d-flex"
                            >
                              Disturbances
                            </label>
                            <textarea
                              type="text"
                              id="sleep_disturbance"
                              rows="4"
                              className="w-100 form-control"
                              value={sleep_disturbance}
                              onChange={(e) =>
                                setSleep_Disturbance(e.target.value)
                              }
                            ></textarea>
                            {errors.sleep_disturbance && (
                              <div className="text-danger text-start">
                                {errors.sleep_disturbance}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label
                          htmlFor="social_interaction"
                          className="form-label fw-semibold d-flex"
                        >
                          Social Interactions
                        </label>
                        <select
                         
                          id="social_interaction"
                          className="form-select"
                          value={social_interaction}
                          onChange={(e) =>
                            setSocial_Interaction(e.target.value)
                          }
                        >
                          <option value="">Select Social Interaction</option>
                          {options.social_interaction.map(
                            (interaction, index) => (
                              <option key={index} value={interaction}>
                                {interaction}
                              </option>
                            )
                          )}
                        </select>
                        {errors.social_interaction && (
                          <div className="text-danger text-start">
                            {errors.social_interaction}
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="stress_level"
                          className="form-label mt-3 fw-semibold d-flex"
                        >
                          Stress Level
                        </label>
                        <select
                        
                          id="stress_level"
                          className="form-select"
                          value={stress_level}
                          onChange={(e) => setStress_Level(e.target.value)}
                        >
                          <option value="">Select Stress Level</option>
                          {options.stress_level.map((stress, index) => (
                            <option key={index} value={stress}>
                              {stress}
                            </option>
                          ))}
                        </select>
                        {errors.stress_level && (
                          <div className="text-danger text-start">
                            {errors.stress_level}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Sleep */}

                    {/* Physical Activity */}
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header d-flex">
                          <h5>Physical Activity</h5>
                        </div>
                        <div className="card-body">
                          <div>
                            <label
                              htmlFor="physical_activity_type"
                              className="form-label fw-semibold d-flex"
                            >
                              Type
                            </label>
                            <select
                            
                              id="physical_activity_type"
                              className="form-select"
                              value={physical_activity_type}
                              onChange={(e) =>
                                setPhysical_Activity_Type(e.target.value)
                              }
                            >
                              <option value="">Select Type</option>
                              {options.physical_activity_type.map(
                                (type, index) => (
                                  <option key={index} value={type}>
                                    {type}
                                  </option>
                                )
                              )}
                            </select>
                            {errors.physical_activity_type && (
                              <div className="text-danger text-start">
                                {errors.physical_activity_type}
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="physical_activity_duration"
                              className="form-label fw-semibold mt-3 d-flex"
                            >
                              Duration
                            </label>
                            <input
                              type="text"
                              className="w-100 form-control"
                              id="physical_activity_duration"
                              value={duration}
                              onChange={handleDurationChange}
                              placeholder="HH:MM"
                              required
                            />
                            {errors.duration && (
                              <div className="text-danger text-start px-2">
                                {errors.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card mt-4">
                          <div className="card-header d-flex">
                            <h5>Symptoms</h5>
                          </div>
                          <div className="card-body ">
                            {options.symptoms.map((symptom, index) => (
                              <div className="form-check" key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`symptoms-${index}`}
                                  value={symptom}
                                  onChange={handleSymptomsChange}
                                />
                                <label
                                  className="form-check-label d-flex text-start"
                                  htmlFor={`symptoms-${index}`}
                                >
                                  {symptom}
                                </label>
                              </div>
                            ))}
                            {errors.symptoms && (
                              <div className="text-danger text-start">
                                {errors.symptoms}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col mt-4">
                    <div className="d-flex justify-content-center">
                      <button className="addbtn" type="submit">
                        Submit Log
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
