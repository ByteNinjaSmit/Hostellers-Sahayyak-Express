"use client"
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaBed, FaUsers, FaWifi, FaUtensils } from "react-icons/fa";
import { MdSecurity, MdCleaningServices } from "react-icons/md";

const RulesAndRegulations = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 1,
      title: "Accommodation and hostel",
      icon: <FaBed className="text-2xl mr-2" />,
      rules: [
        "Rooms must be kept clean and tidy at all times.",
        "No alterations to room structure or furniture without permission.",
        "Do not throw litter on the premises.",
        "Do not leave the taps open.",
        "Do not misbehave with hostel authorities.",
        "Do not go outside the campus after 8:00 PM.",
        "No alcohol, tobacco, or cigarettes are allowed.",
        "Do not go home without the prior permission of the warden or rector.",
        "Do not make noise."
      ]
    },
    {
      id: 2,
      title: "Conduct",
      icon: <FaUsers className="text-2xl mr-2" />,
      rules: [
        "Be on time for classes and college events.",
        "Respect college property; don't damage anything.",
        "Avoid using bad language in public areas.",
        "Do not disturb classes or meetings.",
        "Be open-minded during group discussions.",
        "Use campus facilities responsibly.",
        "Don't get into fights or show aggressive behavior.",
        "Respect others' opinions, even if you disagree.",
        "Keep your phone on silent in classes and study areas.",
        "Represent the college well both on and off campus.",
        "Turn off fans/AC/light while leaving classroom and labs"
      ]
    },
    {
      id: 3,
      title: "Facilities",
      icon: <FaWifi className="text-2xl mr-2" />,
      rules: [
        "Keep all facilities clean and tidy after use.",
        "Report any damages or maintenance issues immediately.",
        "Respect the operating hours of each facility.",
        "No food or drink allowed in certain areas, like libraries or labs.",
        "Follow specific rules for using equipment and technology.",
        "Do not reserve spaces without prior approval from the administration.",
        "Maintain a quiet environment in study areas and libraries.",
        "Follow safety protocols when using laboratories or workshops.",
        "Use facilities only for their intended purpose.",
        "Adhere to any additional rules posted in specific facilities."
      ]
    },
    {
      id: 4,
      title: "Campus",
      icon: <FaUtensils className="text-2xl mr-2" />,
      rules: [
        "Treat everyone with respect, including students, faculty, and staff.",
        "Do not cheat or plagiarize in any academic work.",
        "No illegal drugs are allowed, and alcohol use may be restricted to certain areas or events.",
        "Harassment, bullying, and discrimination of any kind are not tolerated.",
        "Follow safety rules and report anything suspicious.",
        "Keep noise levels down in residential areas and libraries so others can study.",
        "Do not damage or vandalize campus property; report any damage you see.",
        "Follow the guest policy for bringing visitors onto campus or into residence halls.",
        "Wear appropriate clothing or college uniform as required for certain events or areas.",
      ]
    },
    {
      id: 5,
      title: "Security",
      icon: <MdSecurity className="text-2xl mr-2" />,
      rules: [
        "Always carry your student ID while on campus.",
        "Report any suspicious activity to campus security.",
        "Do not share your ID card or keys with others.",
        "Follow the campus entry and exit rules.",
        "Do not leave valuable items unattended in public areas.",
        "Do not tamper with security cameras or alarms.",
        "Respect all security personnel and cooperate when asked."
      ]
    },
    {
      id: 6,
      title: "Maintenance",
      icon: <MdCleaningServices className="text-2xl mr-2" />,
      rules: [
    "Do not take any gadget without taking permisision of the faculty",
    "Report any damages or issues to the maintenance department immediately.",
    "Do not attempt to repair broken equipment or facilities on your own.",
    "Keep common areas clean and free from clutter to avoid maintenance issues.",
    "Follow guidelines for waste disposal to maintain cleanliness.",
    "Avoid tampering with electrical systems.",
    "Inform maintenance staff about any water leaks, electrical issues, or unusual noises.",
    "Ensure that windows and doors are properly closed when not in use.",
    "Respect maintenance schedules and allow staff to perform necessary tasks.",
    "Request permission before making any modifications to rooms or facilities."
      ]
    }
    
  ];

  const toggleCategory = (id) => {
    setActiveCategory(activeCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hostel Rules and Regulations</h1>
         {/*  <nav className="flex justify-center space-x-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.title.toLowerCase()}`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {category.title}
              </a>
            ))}
          </nav> */}
        </header>

        <main>
          {categories.map((category) => (
            <div
              key={category.id}
              id={category.title.toLowerCase()}
              className="mb-6 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center">
                  {category.icon}
                  <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                </div>
                {activeCategory === category.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {activeCategory === category.id && (
                <div className="p-4 bg-gray-50">
                  <ul className="list-disc list-inside space-y-2">
                    {category.rules.map((rule, index) => (
                      <li key={index} className="text-gray-700">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default RulesAndRegulations;