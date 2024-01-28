import HomeLayout from "../Layouts/HomeLayout";
import aboutMainImage from "../Assets/Images/about1.jpeg";
import {celebrities} from '../Constants/CelebrityData'

import CarouselSlide from "../Components/CarouselSlide";
function AboutUs() {

  return (
    <HomeLayout>
      <div className="pt-20 pl-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-yellow-500 text-semibold">
              Affordable and quality education
            </h1>

            <p className="text-xl text-gray-200">
              Our goal is to provide the affordable and quality education to the
              world. We are providinf the platform for aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the grouth and wellness
              mankind.
            </p>
          </section>

          <div className="">
            <img
              id="text1"
              style={{
                style: "drop-shadow(0px,10px,10px rgb(0,0,0,))",
              }}
              className="drop-shadow-2xl"
              src={aboutMainImage}
              alt="about main image"
            />
          </div>
        </div>

        <div className="carousel w-1/2 my-16 m-auto">


        {celebrities && celebrities.map(celebrity => ( 
          <CarouselSlide {...celebrity}
            key={celebrity.slideNumber}
            totalSlide={celebrities.length}
          />
        ))}

        {/* <CarouselSlide/> */}

         


        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
