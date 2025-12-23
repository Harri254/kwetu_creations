import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[#f5f4f4] ">
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        className="w-full max-w-[40rem] max-h-[80%] bg-[#ffffff] p-8 rounded-2xl shadow-lg space-y-5 lg:text-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-[#C4671B] mb-4 underline lg:text-4xl">
          Contact Us
        </h2>

        <div className="">
          <label htmlFor="name" className="block text-[#C4671B] font-semibold mb-2">
            Full Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
            className="w-full border text-primary border-gray-300 rounded-lg px-4 py-2 focus:outline-none "
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[#C4671B] font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border text-primary border-gray-300 rounded-lg px-4 py-2 focus:outline-none "
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-[#C4671B] font-semibold mb-2">
            Message:
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border text-primary border-gray-300 rounded-lg px-4 py-2 min-h-[200px] resize-y focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="block mx-auto w-full py-2 bg-[#C4671B] text-tertiary font-semibold rounded-lg shadow hover:bg-[#a05217] transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;
