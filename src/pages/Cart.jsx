import { faPaypal } from "@fortawesome/free-brands-svg-icons/faPaypal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";


function Cart(){
    const {itemsCount, setItemsCount} = useState(1);

    let increaseItemCount = function (e){
        let count = e.target.value + 1;
        setItemsCount(count);
    }
    let decreaseItemCount = function (e){
        if(e.target.value < 1){
            setItemsCount(1)
        }
        setItemsCount(e.target.value +1);
    }

    return(
        <div className="w-screen flex flex-col justify-center items-center text-center">
            <h2 className="my-10 text-3xl text-primary/80 font-extrabold mb-0 md:text-4xl lg:text-5xl">Confirm & make Payment.</h2>
            <p className="m-0 p-0 text-2xl text-secondary font-bold">"Your vision is our mission"</p>
            <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row p-4 gap-4 rounded-2xl bg-primary/10 relative md:w-[55rem] justify-evenly shadow-2xl w-fit">
                    <div className="w-[250px] h-[200px] bg-primary/40 rounded-2xl md:ml-[-2em]"></div>
                    <div className="flex flex-col items-center justify-center gap-6 text-2xl mt-1 md:mt-6">
                        <div className="">
                            <h3 className="font-medium text-2xl md:text-3xl mb-2">Name of design</h3>
                            <p className="font-medium">Kshs. <span className="text-2xl md:text-4xl">400</span>  <span className="ml-3 text-secondary">Disc. <span >5%</span></span> </p>
                        </div>
                        <div className="flex gap-3 text-tertiary items-center">
                            <button className=" bg-secondary rounded-2xl px-6 py-1" onClick={decreaseItemCount}>-</button>
                            <p className="font-bold text-primary mx-4 text-4xl">{itemsCount}</p>
                            <button className="bg-secondary rounded-2xl px-6 py-1" onClick={increaseItemCount}>+</button>
                        </div>
                    </div>
                    <button className="bg-primary absolute text-white text-2xl px-8 py-2 rounded-2xl right-3 top-3">x</button>
                </div>
                <div className="flex flex-col md:flex-row p-4 gap-4 rounded-2xl bg-primary/10 relative md:w-[55rem] justify-evenly shadow-2xl w-fit">
                    <div className="w-[250px] h-[200px] bg-primary/40 rounded-2xl md:ml-[-2em]"></div>
                    <div className="flex flex-col items-center justify-center gap-6 text-2xl mt-1 md:mt-6">
                        <div className="">
                            <h3 className="font-medium text-2xl md:text-3xl mb-2">Name of design</h3>
                            <p className="font-medium">Kshs. <span className="text-2xl md:text-4xl">400</span>  <span className="ml-3 text-secondary">Disc. <span >5%</span></span> </p>
                        </div>
                        <div className="flex gap-3 text-tertiary items-center">
                            <button className=" bg-secondary rounded-2xl px-6 py-1" onClick={decreaseItemCount}>-</button>
                            <p className="font-bold text-primary mx-4 text-4xl">{itemsCount}</p>
                            <button className="bg-secondary rounded-2xl px-6 py-1" onClick={increaseItemCount}>+</button>
                        </div>
                    </div>
                    <button className="bg-primary absolute text-white text-2xl px-8 py-2 rounded-2xl right-3 top-3">x</button>
                </div>
                <div className="flex flex-col md:flex-row p-4 gap-4 rounded-2xl bg-primary/10 relative md:w-[55rem] justify-evenly shadow-2xl w-fit">
                    <div className="w-[250px] h-[200px] bg-primary/40 rounded-2xl md:ml-[-2em]"></div>
                    <div className="flex flex-col items-center justify-center gap-6 text-2xl mt-1 md:mt-6">
                        <div className="">
                            <h3 className="font-medium text-2xl md:text-3xl mb-2">Name of design</h3>
                            <p className="font-medium">Kshs. <span className="text-2xl md:text-4xl">400</span>  <span className="ml-3 text-secondary">Disc. <span >5%</span></span> </p>
                        </div>
                        <div className="flex gap-3 text-tertiary items-center">
                            <button className=" bg-secondary rounded-2xl px-6 py-1" onClick={decreaseItemCount}>-</button>
                            <p className="font-bold text-primary mx-4 text-4xl">{itemsCount}</p>
                            <button className="bg-secondary rounded-2xl px-6 py-1" onClick={increaseItemCount}>+</button>
                        </div>
                    </div>
                    <button className="bg-primary absolute text-white text-2xl px-8 py-2 rounded-2xl right-3 top-3">x</button>
                </div>
            </div>
            <div className="text-2xl md:text-4xl flex flex-col gap-3 mt-6 md:mt-10">
                <p className="font-bold">Total Amount: <span className="text-secondary md:text-5xl">Kshs. 300/=</span></p> 
            </div>
            <div className="flex flex-col text-2xl md:text-3xl gap-6 my-10 w-xl items-center">
                <p className="">Choose Payment Method</p>
                <button className="text-tertiary bg-primary hover:bg-secondary py-2 px-6 rounded-2xl w-[15rem] md:w-xl">
                    <FontAwesomeIcon icon={faPaypal} /> PayPal
                </button>
                <button className="text-tertiary bg-primary hover:bg-secondary py-2 px-6 rounded-2xl w-[15rem] md:w-xl">
                    <span>Icon</span> M-pesa
                </button>
                <button className="text-tertiary bg-primary hover:bg-secondary py-2 px-6 rounded-2xl w-[15rem] md:w-xl">
                    <span>Icon</span> Airtel
                </button>

            </div>

        </div>
    )
}

export default Cart;