import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";

const Categories = () => {
    // const categorys = [
    //     "Mobiles",
    //     "Laptops",
    //     "Speakers",
    //     "Top wear",
    //     "Footwear",
    //     "Watches",
    //     "Home Decor",
    //     "Smart Watches",
    // ];
    const { categories } = useSelector((auth) => auth.home);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 6,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2,
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1,
        },
    };

    return (
        <div className='w-[87%] mx-auto relative'>
            <div className='w-full'>
                <div className='text-center flex justify-center items-center flex-col text-3xl text-slate-600 font-bold relative pb-[35px]'>
                    <h2>Top Category </h2>
                    <div className='w-[100px] h-[2px] bg-[#059473] mt-4'></div>
                </div>
            </div>
            <Carousel
                autoPlay={true}
                infinite={true}
                arrows={true}
                responsive={responsive}
                transitionDuration={500}
            >
                {categories.map((category) => (
                    <Link
                        className='h-[185px] border block'
                        key={category._id}
                        to={`/products?category=${category.name}`}
                    >
                        <div className='w-full h-full relative p-3'>
                            <img
                                src={category.image}
                                alt=''
                                className='object-cover'
                            />
                            <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                                <span className='py-[2px] px-6 bg-[#3330305d] text-white'>
                                    {category.name}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </div>
    );
};

export default Categories;
