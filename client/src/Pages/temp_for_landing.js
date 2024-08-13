import React from "react";
import PatientNavbar from "../Components/PatientNavbar";

const LandingPage = () => {
  return (
    <>
      <PatientNavbar />
      <div className="md:min-h-full md:flex md:flex-col">
        <section className="md:flex-row lg:flex-row relative md:flex justify-center items-center">
          <div className="w-full p-10 md:w-3/5 bg-user_primary text-white h-full md:flex justify-center items-center md:text-sm ">
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
                <button className="bg-user_secondary text-2xl text-user_primary hover:bg-gray-300 delay-200 px-4 py-2 rounded-md">
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

        <section className="flex-1 bg-gray-200">
          {/* Services section content */}
        </section>

        <section className="flex-1 bg-gray-300">
          {/* About us section content */}
        </section>

        <section className="flex-1 bg-gray-400">
          {/* Contact us section content */}
        </section>
      </div>
    </>
  );
};

export default LandingPage;
