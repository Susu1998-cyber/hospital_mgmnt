import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorsCard from "./DoctorCard";
import "./Doctor.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    speciality: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const handleAddDoctor = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/doctors/add", newDoctor)
      .then((response) => {
        console.log(response.data);
        setDoctors([...doctors, response.data]);
        setNewDoctor({
          name: "",
          speciality: "",
        });
      })
      .catch((error) => console.error("Error adding Doctor:", error));
  };

  const handleUpdateDoctor = (id, e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:5000/doctors/update/${id}`, selectedDoctor)
      .then((response) => {
        console.log(response.data);
        const updateDoc = { ...selectedDoctor, _id: id };

        console.log("update doc", updateDoc);
        setDoctors(
          doctors.map((doctor) => (doctor._id === id ? updateDoc : doctor))
        );
        setSelectedDoctor(null);
        setIsEditMode(false);
      });
  };

  const handleDelteDoctor = (id) => {
    axios
      .delete(`http://localhost:5000/doctors/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        setDoctors(doctors.filter((doctor) => doctor._id !== id));
      })
      .catch((error) => console.error("Error deleting Doctor: ", error));
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditMode(true);
  };

  return (
    <div className="main-doc-container">
      <div className="form-sections">
        <h4>{isEditMode ? "Edit Doctor" : "Add New Doctor"}</h4>
        <form
          onSubmit={
            isEditMode
              ? (e) => handleUpdateDoctor(selectedDoctor._id, e)
              : handleAddDoctor
          }
        >
          <label>Patient Name:</label>
          <input
            type="text"
            value={isEditMode ? selectedDoctor.name : newDoctor.name}
            onChange={(e) =>
              isEditMode
                ? setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                : setNewDoctor({ ...newDoctor, name: e.target.value })
            }
          />
          <label>Speciality:</label>
          <input
            type="text"
            value={
              isEditMode ? selectedDoctor.speciality : newDoctor.speciality
            }
            onChange={(e) =>
              isEditMode
                ? setSelectedDoctor({
                    ...selectedDoctor,
                    speciality: e.target.value,
                  })
                : setNewDoctor({ ...newDoctor, speciality: e.target.value })
            }
          />
          <br />
          <button>{isEditMode ? "Update Doctor" : "Add Doctor"}</button>
        </form>
      </div>
      <div className="doctors-section">
        <h3>Doctors ({doctors.length})</h3>
        <div className="doctor-list">
          {doctors.map((doctor) => (
            <DoctorsCard
              key={doctor._id}
              doctor={doctor}
              onEdit={handleEditDoctor}
              onDelete={handleDelteDoctor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
