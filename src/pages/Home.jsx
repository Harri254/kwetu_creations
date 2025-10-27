import book from '../assets/photos/book.jpg'
import coding from '../assets/photos/coding.jpg'
import design from '../assets/photos/design.jpg'
import light from '../assets/photos/i see the light.jpg'
import laptop from '../assets/photos/laptop.jpg'
import microphone from '../assets/photos/microphone.jpg'
import place from '../assets/photos/place.jpg'
import smile from '../assets/photos/smile.jpg'
import worker from '../assets/photos/worker.jpg'

const gallary = [
    { id: 1, image: book, price: 400, category: "latest" },
    { id: 6, image: design, price: 400, category: "latest" },
    { id: 5, image: coding, price: 400, category: "latest" },
    { id: 2, image: light, price: 500, category: "products" },
    { id: 3, image: laptop, price: 350, category: "products" },
    { id: 11, image: laptop, price: 350, category: "products" },
    { id: 4, image: microphone, price: 600, category: "products" },
    { id: 7, image: place, price: 500, category: "services" },
    { id: 8, image: smile, price: 350, category: "services" },
    { id: 12, image: smile, price: 350, category: "services" },
    { id: 9, image: worker, price: 600, category: "services" },
    { id: 10, image: worker, price: 600, category: "latest" },
];

const sortedLatest = gallary.filter((product) => product.category === "latest");
const sortedProducts = gallary.filter((product) => product.category === "products");
const sortedService = gallary.filter((product) => product.category === "services");
console.log(sortedLatest);

function Body(){
    return(
        <div className="flex flex-col gap-2 m-5">
            <div className="flex flex-col">
                <h2 className="text-5xl text-[#c4671b] font-medium">Latest</h2>
                <div className="flex gap-6 justify-center mt-4 flex-wrap">
                    {sortedLatest.map((gal) => (
                    <div key={gal.id} className="w-[95%] mx-auto sm:w-[48%] lg:w-[30%]">
                        <img
                        className="hover:scale-[0.99] rounded-2xl w-full h-72 sm:h-[20rem] object-cover"
                        src={gal.image}
                        alt={gal.category}
                        />
                    </div>
                    ))}
                </div>

            </div>

            <div className="flex flex-col">
                <h2 className="text-[#964a0b] text-5xl mt-5 font-medium">Products</h2>
                <h3 className="text-[#c4671b] text-3xl text-center">Templates</h3>
                <div className="flex gap-6 justify-center mt-4 flex-wrap">
                    {sortedProducts.map((gal) => (
                    <div key={gal.id} className="w-[95%] mx-auto sm:w-[48%] lg:w-[30%]">
                        <img
                        className="hover:scale-[0.99] rounded-2xl w-full h-72 sm:h-[20rem] object-cover"
                        src={gal.image}
                        alt={gal.category}
                        />
                    </div>
                    ))}
                </div>

            </div>
            <div className="flex-col">
                <h2 className="text-[#964a0b] text-5xl mt-5 font-medium">Services</h2>
                <div className="flex-col">
                    <h3 className="text-[#c4671b] text-3xl text-center">Designs</h3>
                    <div className="flex gap-6 justify-center mt-4 flex-wrap">
                        {sortedService.map((gal) => (
                        <div key={gal.id} className="w-[95%] mx-auto sm:w-[48%] lg:w-[30%]">
                            <img
                            className="hover:scale-[0.99] rounded-2xl w-full h-72 sm:h-[20rem] object-cover"
                            src={gal.image}
                            alt={gal.category}
                            />
                        </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Body;