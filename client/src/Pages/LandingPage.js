import React from "react";
import PatientNavbar from "../Components/PatientNavbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  FaAmbulance,
  FaStethoscope,
  FaHeart,
  FaBrain,
  FaBone,
  FaChild,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const services = [
  {
    title: "First Aid",
    description:
      "Get immediate assistance with our First Aid services. Your safety is our top priority.",
    icon: <FaAmbulance />,
  },
  {
    title: "Physician",
    description:
      "Consult with our experienced Physicians for comprehensive healthcare solutions tailored to your needs.",
    icon: <FaStethoscope />,
  },
  {
    title: "Cardiology",
    description:
      "Take care of your heart health with our Cardiology services. We specialize in cardiac care and prevention.",
    icon: <FaHeart />,
  },
  {
    title: "Neurology",
    description:
      "For neurological disorders and conditions, our Neurology department offers expert diagnosis and treatment.",
    icon: <FaBrain />,
  },
  {
    title: "Orthopedics",
    description:
      "Our Orthopedic specialists provide care for bone and joint problems, including surgeries and rehabilitation.",
    icon: <FaBone />,
  },
  {
    title: "Pediatrics",
    description:
      "Dedicated to children's health, our Pediatrics services ensure your child's well-being and development.",
    icon: <FaChild />,
  },
  // Add more services as needed with their respective descriptions and icons
];

const LandingPage = () => {
  const navigate = useNavigate();
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <>
      <PatientNavbar />
      <div className="md:min-h-full md:flex md:flex-col ">
        <section className="md:flex-row lg:flex-row relative md:flex justify-center items-center">
          <div className="w-full md:p-10 p-10 md:w-3/5 bg-user_primary text-white h-full md:flex justify-center items-center md:text-sm ">
            <div className="flex flex-col justify-center items-start text-left md:px-5 md:my-9 xl:my-40">
              <p className="text-xl text-user_secondary">
                An Excellent organization for healthcare.
              </p>
              <br />
              <h1 className="text-4xl md:text-4xl lg:text-7xl">Professional</h1>
              <h1 className="text-4xl md:text-4xl lg:text-7xl">
                Doctors are Here!
              </h1>
              <br />
              <p className="text-xl md:text-xl lg:text-2xl">
                The effect of the treatment on the physical, emotional, and
              </p>
              <p className="text-xl md:text-xl lg:text-2xl">
                cognitive functions of the individual
              </p>
              <br />
              <div className="w-full flex items-start mt-6">
                <button
                  className="bg-user_secondary text-2xl text-user_primary hover:bg-gray-300 delay-200 px-4 py-2 rounded-md"
                  onClick={() => {
                    navigate("/user/login");
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>

          <div className=" md:w-2/5 bg-user_secondary justify-center items-center ">
            <div className="md:my-24 lg:my-1">
              <lottie-player
                src="https://lottie.host/519d424e-c109-441d-a59a-9fa2a24a0e8b/yUbrgCP93O.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                direction="1"
                mode="normal"
                // style={{ width: "100%", height: "auto" }}
              ></lottie-player>
            </div>
          </div>
        </section>

        <section className="flex-1 bg-white rounded-lg p-4 my-5">
          <div className="container mx-auto py-10">
            <h2 className="text-4xl font-bold text-user_primary mb-8">
              Our Services
            </h2>
            <Carousel responsive={responsive} infinite>
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-user_secondary p-10 rounded-md m-4"
                >
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

        {/* About Us Section */}
        <section className="flex-1 bg-user_primary p-10">
          <div className="container mx-auto py-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white items-start p-8">
              About Us
            </h2>
            <img
              src="https://clin.cmcvellore.ac.in/webapt/images/drapt2.png"
              alt="Hospital"
              className="w-48 h-48 mb-6"
            />
            <p className="text-lg text-white text-center max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              condimentum nibh vel tincidunt. Praesent congue nisl id urna
              cursus, ut dapibus odio dictum.
            </p>
          </div>
        </section>

        <section className="flex-1 bg-user_secondary">
          <div className="container mx-auto py-10 flex flex-col items-center bg-user_secondary">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-2">
                Hospital Contact Information
              </h3>
              <p className="text-gray-600">
                <FaPhone className="inline-block mr-2 text-user_primary mb-2 md:mb-0" />
                <a href="tel:1234567890" className="text-user_primary">
                  123-456-7890
                </a>
                <br />
                <FaEnvelope className="inline-block mr-2 text-user_primary mb-2 md:mb-0" />
                <a
                  href="mailto:contact@example.com"
                  className="text-user_primary"
                >
                  contact@example.com
                </a>
                <br />
                <FaMapMarkerAlt className="inline-block mr-2 text-user_primary" />
                123 Main Street, City, Country
              </p>
            </div>
          </div>
        </section>

        <footer className="bg-user_primary py-6">
          <div className="container mx-auto text-white text-center">
            <div className="flex justify-center space-x-4">
              <a
                href="your_facebook_url"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="your_twitter_url"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="your_instagram_url"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="your_linkedin_url"
                className="text-gray-400 hover:text-white"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
            <p className="text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Doctor's Clinic. All Rights
              Reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
