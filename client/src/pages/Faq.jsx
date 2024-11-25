"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ= () => {
  const [activeQuestion, setActiveQuestion] = useState(null);



  const faqs = [
    {
      question: "How long does it take to process a grievance?",
      answer: "Typically, grievances are processed within 7-10 working days."
    },
    {
      question: "Can I submit anonymous complaints?",
      answer: "Yes, all complaints must be submitted with valid student credentials, but are anonymous to the rector."
    },
    {
      question: "What types of grievances can I report?",
      answer: "You can report all types of issues related to hostel facilities, mess, security, or any other hostel-related concerns."
    },
    {
      question: "What should I do if my issue is not resolved?",
      answer: "If your issue isn't resolved in time, its severity will automatically increase, and it will be sent to a higher authority. Otherwise, you can file an 'action' on that issue."
    },
    {
      question: "Who reviews my grievance?",
      answer: "First, the issue is reviewed by the hostel rector. If it isn't resolved, it is then transferred to the higher hostel authority."
    },
    {
      question: "Is there any limit to the number of complaints I can file?",
      answer: "There is no limit, but please submit only genuine issues."
    },
    {
      question: "Can I track the status of my grievance?",
      answer: "Yes, you can track the progress of your complaint through the grievance portal."
    },
    {
      question: "What happens if I file a false complaint?",
      answer: "Filing false complaints may result in penalties, including suspension of complaint privileges."
    },
    {
      question: "Can I withdraw my grievance after filing it?",
      answer: "Yes, you can withdraw your complaint at any time before it is resolved."
    },
    {
      question: "What details do I need to provide when filing a grievance?",
      answer: "You need to provide a clear description of the issue, location, and any relevant details to help resolve the matter faster."
    },
    {
      question: "Can I report grievances on behalf of another student?",
      answer: "No, grievances must be filed individually to ensure accuracy and accountability."
    },
    {
      question: "Is there a time limit for filing a grievance?",
      answer: "No, but it’s recommended to file your complaint as soon as possible after the issue arises to ensure timely resolution."
    }
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl bg-white"
            >
              <button
                className="w-full text-left p-5 focus:outline-none flex justify-between items-center"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                {activeQuestion === index ? (
                  <FaChevronUp className="text-blue-600 ml-2 flex-shrink-0 transition-transform transform rotate-180" />
                ) : (
                  <FaChevronDown className="text-blue-600 ml-2 flex-shrink-0 transition-transform" />
                )}
              </button>
              {activeQuestion === index && (
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;