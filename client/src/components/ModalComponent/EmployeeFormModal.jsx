import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Styles from "./Styles/EmployeeForm.module.css"; 
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {convertToISO8601} from '../../../helpers/ChangeDateFormat.js'


import "react-datepicker/dist/react-datepicker.css";
import CreatableSelect from "react-select/creatable";
import axios from 'axios';
import {toast} from 'react-hot-toast'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const isValidTime = (time) => {
  const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/i;
  return timePattern.test(time);
};

const EmployeeFormModal = ({ isOpen, onRequestClose }) => {


 

       const [selectedDate, setSelectedDate] = useState(null);

       const handleDateChange = (date) => {
         setSelectedDate(date);
         console.log(date);
        //  let newDate=  convertToISO8601(date);
        //  console.log(newDate)

         console.log('somthingwent rong')
       };

    const [employeeName, setEmployeeName] = useState('');
    const [time, setTime] = useState([]);
    const [services, setServices] = useState([]);
     
   
    const handleSubmit= async(e)=>{

      e.preventDefault()

      const isTimeValid = time.every((option) => isValidTime(option.value));
      if (!isTimeValid) {
        toast.error("Invalid time format entered");
        return;
      }

     
      try {
           let employee = employeeName.value;
          //  let selectedDateFormat= new Date(selectedDate);
          //  let stringDate= selectedDateFormat.toISOString();
          //  console.log(selectedDateFormat.toISOString());
           const details = {
             employeeName: employee,
             //  time: time.map((timeSlot) => ({
             //    time: timeSlot.value,
             //    isAvailable: true,
             //  })),
             time: time.map((item) => item.value),
             services: services.map((option) => option.value),
             selectDate: selectedDate,
           };

           console.log(details);
           const { data } = await axios.post("/s/sAddEmployee", {
             details,
           });
           if (data.error) {
             toast.error(data.error);
           }else{
             onRequestClose();
           }

      } catch (error) {
        console.log(error)
        toast.error("something went wrong")
      }

   
    }
 const today = new Date().toISOString().split("T")[0];


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={Styles.modal}
      overlayClassName={Styles.overlay}
    >
      <h2>Add Employee</h2>
      <div className={Styles.form_group}>
        <label className={Styles.label}>Employee Name</label>
        <CreatableSelect
          isClearable
          value={employeeName}
          onChange={(selectedOption) => {
            setEmployeeName(selectedOption);
          }}
          className={Styles.selector}
        />
        {/* <CreatableSelect value={employeeName} onChange={(selectedOption)=>{setEmployeeName(selectedOption);}} className={Styles.selector} /> */}
      </div>
      <div className={Styles.form_group}>
        <label className={Styles.label}>Time</label>
        <CreatableSelect
          placeholder="Add Time yy:yy format...."
          value={time}
          onChange={(selectedOptions) => {
            setTime(selectedOptions);
          }}
          className={Styles.selector}
          isMulti
        />
      </div>
      <div className={Styles.form_group}>
        <label className={Styles.label}>Services</label>
        <CreatableSelect
          placeholder="Add Services...."
          value={services}
          onChange={(selectedOptions) => {
            setServices(selectedOptions);
          }}
          className={Styles.selector}
          isMulti
        />
      </div>
      <div className={Styles.form_group}>
        <label className={Styles.label}>Date</label>
        {/* <DatePicker
          className={Styles.selector}
          selected={selectedDate}
          onChange={handleDateChange}
         
          placeholderText="Select a date"
          minDate={currentDate}
          showIcon={true}
        /> */}
        <input
          type="date"
          className={Styles.selector}
          min={today}
          onChange={(e) => handleDateChange(e.target.value)}
          value={selectedDate}
        />
      </div>

      <div className={Styles.button_container}>
        <button className={Styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default EmployeeFormModal;
