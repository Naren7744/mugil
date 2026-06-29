import React, { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCreditCard,
  FiCamera,
  FiActivity,
  FiSave,
} from "react-icons/fi";

function AddMember() {
  const generatedId = `MF${String(
    Math.floor(Math.random() * 999)
  ).padStart(3, "0")}`;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    branch: "Mugil Fitness",
    gender: "Male",
    membership: "Premium Annual",
    paymentStatus: "Paid",
    weight: "",
    height: "",
    bodyFat: "",
    emergencyName: "",
    emergencyPhone: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Member Added Successfully");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-violet-600 uppercase tracking-[3px] text-xs font-bold">
              Membership Registration
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Add New Member
            </h1>

          </div>

          <div className="mt-5 lg:mt-0">

            <span className="px-5 py-3 rounded-2xl bg-violet-100 text-violet-600 font-bold">
              ID : {generatedId}
            </span>

          </div>

        </div>

      </div>

      <div className="grid xl:grid-cols-3 gap-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8"
        >

          {/* PHOTO */}
          <div className="mb-8">

            <div className="w-28 h-28 rounded-[28px] bg-slate-100 flex items-center justify-center">

              <FiCamera className="text-3xl text-slate-500" />

            </div>

            <input
              type="file"
              className="mt-4 text-sm"
            />

          </div>

          {/* PERSONAL INFO */}
          <h3 className="text-lg font-bold mb-5">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <InputField
              icon={<FiUser />}
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <InputField
              icon={<FiPhone />}
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <InputField
              icon={<FiMail />}
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              icon={<FiMapPin />}
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

          </div>

          {/* MEMBERSHIP */}
          <h3 className="text-lg font-bold mt-10 mb-5">
            Membership Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="h-14 rounded-2xl border border-slate-200 px-4"
            >
              <option>Mugil Fitness</option>
              <option>SP Fitness</option>
            </select>

            <select
              name="membership"
              value={formData.membership}
              onChange={handleChange}
              className="h-14 rounded-2xl border border-slate-200 px-4"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Half Year</option>
              <option>Premium Annual</option>
            </select>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="h-14 rounded-2xl border border-slate-200 px-4"
            >
              <option>Male</option>
              <option>Female</option>
            </select>

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="h-14 rounded-2xl border border-slate-200 px-4"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>

          </div>

          {/* BODY METRICS */}
          <h3 className="text-lg font-bold mt-10 mb-5">
            Body Metrics
          </h3>

          <div className="grid md:grid-cols-3 gap-5">

            <InputField
              icon={<FiActivity />}
              name="weight"
              placeholder="Weight (KG)"
              value={formData.weight}
              onChange={handleChange}
            />

            <InputField
              icon={<FiActivity />}
              name="height"
              placeholder="Height (CM)"
              value={formData.height}
              onChange={handleChange}
            />

            <InputField
              icon={<FiActivity />}
              name="bodyFat"
              placeholder="Body Fat %"
              value={formData.bodyFat}
              onChange={handleChange}
            />

          </div>

          {/* EMERGENCY */}
          <h3 className="text-lg font-bold mt-10 mb-5">
            Emergency Contact
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <InputField
              icon={<FiUser />}
              name="emergencyName"
              placeholder="Contact Name"
              value={formData.emergencyName}
              onChange={handleChange}
            />

            <InputField
              icon={<FiPhone />}
              name="emergencyPhone"
              placeholder="Contact Number"
              value={formData.emergencyPhone}
              onChange={handleChange}
            />

          </div>

          {/* NOTES */}
          <div className="mt-8">

            <textarea
              name="notes"
              rows="5"
              placeholder="Additional Notes..."
              value={formData.notes}
              onChange={handleChange}
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                p-4
                outline-none
              "
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              mt-8
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <FiSave />

            Save Member

          </button>

        </form>

        {/* SUMMARY CARD */}
        <div className="space-y-6">

          <div className="bg-white border border-slate-200 rounded-[32px] p-8">

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Membership Summary
            </h3>

            <div className="space-y-5">

              <SummaryItem
                label="Member ID"
                value={generatedId}
              />

              <SummaryItem
                label="Branch"
                value={formData.branch}
              />

              <SummaryItem
                label="Plan"
                value={formData.membership}
              />

              <SummaryItem
                label="Payment"
                value={formData.paymentStatus}
              />

            </div>

          </div>

          <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-[32px] p-8 text-white">

            <FiCreditCard className="text-4xl mb-5" />

            <h3 className="text-2xl font-bold">
              Premium Membership
            </h3>

            <p className="mt-3 text-white/80">
              Create member profile, assign plan,
              track attendance and monitor progress.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function InputField({
  icon,
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="relative">

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>

      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-14
          pl-12
          pr-4
          rounded-2xl
          border
          border-slate-200
          outline-none
          focus:border-violet-500
        "
      />

    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

export default AddMember;