import React from "react";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiChatBubbleBottomCenter } from 'react-icons/hi2';


export default function Contact() {
  return (
     <div id="contact-us" className="py-16">
      <div className="px-4 md:px-8 lg:px-16 xl:px-24 flex flex-col md:flex-row justify-between items-center md:gap-8 space-y-8 md:space-y-0">
        {/* left side */}
        <div className="flex flex-col space-y-4 md:space-y-6 w-full md:w-auto">
          <span className="text-orange-500 text-lg md:text-xl">Our Contact Us</span>
          <span className="text-2xl md:text-3xl font-bold">Easy to contact us</span>
          <span className="text-base md:text-lg text-gray-600">
            We always ready to help by providing the best services for you. We believe a good place to live can make your life better.
          </span>

          <div className="flex flex-col space-y-8 w-full">
            {/* first row */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <ContactMode icon={MdCall} title="Call" detail="021 123 145 14" buttonText="Call now" />
              <ContactMode icon={BsFillChatDotsFill} title="Chat" detail="021 123 145 14" buttonText="Chat now" />
            </div>

            {/* second row */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <ContactMode icon={BsFillChatDotsFill} title="Video Call" detail="021 123 145 14" buttonText="Video Call now" />
              <ContactMode icon={HiChatBubbleBottomCenter} title="Message" detail="021 123 145 14" buttonText="Message now" />
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flex justify-center items-center w-full md:w-auto">
          <div className="w-full md:w-96">
            <img src="https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg?uid=R152627132&semt=sph" alt="Contact" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactMode = ({ icon: Icon, title, detail, buttonText }) => (
  <div className="flex flex-col space-y-4 w-full md:w-64 p-4 border border-gray-300 rounded-md transition-transform duration-300 ease-in hover:scale-105 hover:shadow-lg">
    <div className="flex items-center gap-4">
      <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded-full">
        <Icon size={25} className="text-blue-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-gray-600">{detail}</span>
      </div>
    </div>
    <div className="flex justify-center items-center w-full py-2 bg-blue-200 text-blue-600 font-semibold rounded hover:bg-blue-500 hover:text-white">
      {buttonText}
    </div>
  </div>
  )
