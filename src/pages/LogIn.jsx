import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { mockUsers } from "../context/mockUsers";
import Owner from "./Owner";

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
 const navigate = useNavigate();
  const handleSubmit = (e)=>{
    e.preventDefault();

    const user = mockUsers.find((user) => user.username === username && user.password === password);
    console.log(mockUsers, password,username ,user);
    
    if(!user){
      setError("Invalid Credentials");
    }

    if(user.role === "admin"){
      navigate("/owner");
    }else{
      navigate("/", {replace : true});
    }
  };



  return (
    <div className="py-4 bg-[#f5f4f4] flex flex-col justify-center items-center pb-14">
      <h3 className="w-[90%] my-4 mx-auto text-3xl text-start text-primary font-medium ">
        Log In:
      </h3>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col p-4 bg-[#ffffff] text-[1.3rem] drop-shadow-blue-600 drop-shadow-xs rounded-3xl w-[90%] vsm:h-fit max-w-[30rem] vsm:text-2xl"
      >
        <label htmlFor="username" className="text-secondary pl-2 sm:pt-4">
          {" "}
          Username :
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="border-1 w-[95%] mx-auto rounded-[0.5rem] mt-2 h-11 pl-2 sm:py-6 sm:mt-3"
          required
          autoFocus
          maxLength={24}
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <label htmlFor="password" className="mt-2 text-secondary pl-2 sm:mt-4">
          Password :
        </label>
        <div className="relative w-[95%] mx-auto mt-2 sm:mt-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="border-1 rounded-[0.5rem] pl-2 pr-10 h-11 w-full sm:py-6"
            required
            maxLength={24}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <div className="flex flex-col justify-between m-3 vsm:flex-row vsm:w-[90%] vsm:mx-auto">
          <button
            type="submit"
            className="bg-secondary w-[10rem] mx-auto rounded-[1rem] p-1 hover:bg-amber-800 text-white vsm:w-[45%] vsm:mx-0"
          >
            Log In
          </button>
          <button
            type="button"
            className=" text-secondary hover:text-amber-800 sm:w-[48%]"
          >
            Forgot Password
          </button>
        </div>
        {error && <p className="text-red-700 text-[1.2rem] text-center mb-2">{error}</p>}
        <p className="text-[1.3rem] m-0 text-center sm:text-2xl">
          Do not have an account?{" "}
          <Link
            to="/logIn/createAccount"
            className=" text-secondary hover:text-amber-800 block"
          >
            Create Account
          </Link>
        </p>

      </form>
    </div>
  );
}

export default LogIn;
