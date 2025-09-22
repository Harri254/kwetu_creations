import './Home.css'
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
        <div className="main-container">
            <div className="latest">
                <h2>Latest</h2>
                <div className="latest-I">
                    <img src={book} alt="book" />
                    <img src={coding} alt="coding" />
                    <img src={design} alt="design" />
                </div>
            </div>
            <div className="products categories">
                <h2>Products</h2>
                <div className="product-container cont">
                    <h3>Templates</h3>
                    <div className="product-I">
                        <img src={light} alt="light" />
                        <img src={laptop} alt="laptop" />
                        <img src={microphone} alt="microphone" />
                    </div>
                </div>
            </div>
            <div className="services categories">
                <h2>Services</h2>
                <div className="service-container cont">
                    <h3>Designs</h3>
                    <div className="service-I">
                        <img src={place} alt="place" />
                        <img src={smile} alt="smile" />
                        <img src={worker} alt="worker" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Body;