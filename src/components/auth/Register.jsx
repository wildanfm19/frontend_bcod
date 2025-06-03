import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../shared/InputField';
import { useDispatch } from 'react-redux';
import { registerNewUser } from '../../store/actions';
import toast from 'react-hot-toast';
import { logo } from "../../utils/constant";

const Register = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader , setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        mode:"onTouched",
    });

    const registerHandler = async (data) =>{
      console.log("Register payload:", data);
      dispatch(registerNewUser(data,toast,reset,navigate , setLoader));
    };

    

    return(
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(registerHandler)}
                className="sm:w[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded m-10">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <img
                             className="text-slate-800 text-5xl" 
                             src={logo}
                        />
                        <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                            Register Here
                        </h1>
                    </div>

                <h2 className="mt-2 mb-5 text-black "/>
                <div className="flex flex-col gap-3">
                    <InputField
                        label="Username"
                        required
                        id="username"
                        type="text"
                        message="Username is required"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Full Name"
                        required
                        id="full_name"
                        type="text"
                        message="Full Name is required"
                        placeholder="Enter your full name"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="Email is required"
                        placeholder="Enter your Email"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Password"
                        required
                        id="password"
                        min={6}
                        type="password"
                        message="Password is required"
                        placeholder="Enter your password"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="NIM"
                        required
                        id="nim"
                        min={10}
                        max={10}
                        type="text"
                        message="NIM is required & must be 10 digits"
                        placeholder="Enter your NIM (10 digits)"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "NIM is required",
                          minLength: { value: 10, message: "NIM must be 10 digits" },
                          maxLength: { value: 10, message: "NIM must be 10 digits" },
                          pattern: { value: /^\d{10}$/, message: "NIM must be 10 digits (numbers only)" }
                        }}
                    />

                    <InputField
                        label="Major"
                        required
                        id="jurusan"
                        min={6}
                        type="text"
                        message="Major is required"
                        placeholder="Enter your Major"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Phone Number"
                        required
                        id="phone_number"
                        min={11}
                        max={14}
                        type="text"
                        message="Phone Number is required & must start with 62 and be 11-14 digits"
                        placeholder="Example: 628123456789"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Phone Number is required",
                          minLength: { value: 11, message: "Phone number must be at least 11 digits" },
                          maxLength: { value: 14, message: "Phone number must be at most 14 digits" },
                          pattern: {
                            value: /^62[0-9]{9,12}$/,
                            message: "Phone number must start with 62 followed by 9-12 digits"
                          }
                        }}
                    />

                    <InputField
                        label="Password Reset Key"
                        required
                        id="reset_key"
                        type="text"
                        message="Password Reset Key is required & must be at least 6 characters"
                        placeholder="Enter your password reset key"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Password Reset Key is required",
                          minLength: { value: 6, message: "Password Reset Key must be at least 6 characters" }
                        }}
                    />

                    
                </div>

                <button
                    disabled={loader}
                    className={`bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 flex gap-2 items-center justify-center font-semibold w-full py-2 transition-all duration-150 rounded-sm my-3 ${ 
                      loader ? 'bg-gray-700 cursor-not-allowed' : ''
                    }`}
                    type="submit">
                    {loader ? (
                        <>Loading...</>
                    ) : (
                        <>Register</>
                    )}
                </button>

                <p className="text-center text-sm text-slate-700 mt-6">
                   Already have an account?
                    <Link
                        className="font-semibold underline hover:text-black"
                        to="/login">
                        <span >Login</span>
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Register