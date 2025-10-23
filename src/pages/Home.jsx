import book from '../assets/photos/book.jpg'
import coding from '../assets/photos/coding.jpg'
import design from '../assets/photos/design.jpg'
import light from '../assets/photos/i see the light.jpg'
import laptop from '../assets/photos/laptop.jpg'
import microphone from '../assets/photos/microphone.jpg'
import place from '../assets/photos/place.jpg'
import smile from '../assets/photos/smile.jpg'
import worker from '../assets/photos/worker.jpg'

function Body(){
    return(
        <div className="flex flex-col gap-2 m-5">
            <div className="flex flex-col">
                <h2 className="text-5xl text-[#c4671b] ">Latest</h2>
                <div className="flex flex-col gap-6 w-[100%] mt-4 h-fit justify-center sm:flex-row sm:flex-wrap sm:gap-3">
                    <img className="hover:scale-95 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={book} alt="book" />
                    <img className="hover:scale-95 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={coding} alt="coding" />
                    <img className="hover:scale-95 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={design} alt="design" />
                </div>
            </div>
            <div className="flex flex-col">
                <h2 className="text-[#964a0b] text-5xl mt-5">Products</h2>
                <div className="flex-col">
                    <h3 className="text-[#c4671b] text-3xl text-center">Templates</h3>
                    <div className="flex flex-col gap-6 justify-center mt-4 sm:flex-row sm:flex-wrap sm:gap-3">
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={light} alt="light" />
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={laptop} alt="laptop" />
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={microphone} alt="microphone" />
                    </div>
                </div>
            </div>
            <div className="flex-col">
                <h2 className="text-[#964a0b] text-5xl mt-5">Services</h2>
                <div className="flex-col">
                    <h3 className="text-[#c4671b] text-3xl text-center">Designs</h3>
                    <div className="flex flex-col gap-6 justify-center mt-4 sm:flex-row sm:flex-wrap sm:gap-3 lg:gap-5">
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={place} alt="place" />
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={smile} alt="smile" />
                        <img className="hover:scale-99 rounded-2xl w-[95%] mx-auto h-86 sm:w-[48%] sm:h-[24rem] lg:w-[32%]" src={worker} alt="worker" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Body;