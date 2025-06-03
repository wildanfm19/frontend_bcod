import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, TextField, CircularProgress } from '@mui/material';
import { FaCopy } from 'react-icons/fa';
import { logo } from "../../utils/constant";

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalModalOpen] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState('requestToken');
    const [resetToken, setResetToken] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const {
        register: registerRequestToken,
        handleSubmit: handleSubmitRequestToken,
        reset: resetRequestToken,
        formState: { errors: errorsRequestToken },
    } = useForm({
        mode: "onTouched",
    });

    const {
        register: registerResetPassword,
        handleSubmit: handleSubmitResetPassword,
        reset: resetResetPassword,
        formState: { errors: errorsResetPassword },
    } = useForm({
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
    };

    const handleForgotPasswordClick = () => {
        setIsForgotPasswordModalModalOpen(true);
        setForgotPasswordStep('requestToken');
        setForgotPasswordError(null);
        setResetToken('');
        resetRequestToken();
        resetResetPassword();
    };

    const handleCloseForgotPasswordModal = () => {
        setIsForgotPasswordModalModalOpen(false);
        setTimeout(() => {
            setForgotPasswordStep('requestToken');
            setForgotPasswordError(null);
            setResetToken('');
            resetRequestToken();
            resetResetPassword();
        }, 300);
    };

    const handleRequestToken = async (data) => {
        setLoader(true);
        setForgotPasswordError(null);
        try {
            const response = await fetch('https://api-bettabeal.dgeo.id/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.code === '000') {
                setResetToken(result.data.reset_token);
                setForgotPasswordStep('resetPassword');
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(', ');
                    setForgotPasswordError(errorMessages);
                } else {
                    setForgotPasswordError(result.message || 'Failed to request password reset token.');
                }
                setForgotPasswordStep('error');
            }
        } catch (error) {
            console.error('Error requesting reset token:', error);
            setForgotPasswordError('An error occurred while requesting the reset token.');
            setForgotPasswordStep('error');
        } finally {
            setLoader(false);
        }
    };

    const handleResetPassword = async (data) => {
        setLoader(true);
        setForgotPasswordError(null);
        try {
            const response = await fetch('https://api-bettabeal.dgeo.id/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reset_token: resetToken, new_password: data.new_password }),
            });
            const result = await response.json();

            if (result.code === '000') {
                setForgotPasswordStep('success');
                toast.success(result.message || 'Password reset successfully!');
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(', ');
                    setForgotPasswordError(errorMessages);
                } else {
                    setForgotPasswordError(result.message || 'Failed to reset password.');
                }
                setForgotPasswordStep('error');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setForgotPasswordError('An error occurred while resetting the password.');
            setForgotPasswordStep('error');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(loginHandler)}
                className="sm:w[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded">
                <div className="flex flex-col items-center justify-center space-y-4">
                   <img
                     className="text-slate-800 text-5xl" 
                     src={logo}
                   />
                    <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                        Login Here
                    </h1>
                </div>

                <div className="mt-8 space-y-4">
                    <InputField
                        label="Username"
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                        validation={{
                            required: "Username is required",
                        }}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        register={register}
                        errors={errors}
                        validation={{
                            required: "Password is required",
                        }}
                    />

                    <div className="text-right text-sm mt-2">
                        <button
                            type="button"
                            onClick={handleForgotPasswordClick}
                            className="text-blue-600 hover:underline focus:outline-none"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loader}
                        className={`w-full text-white py-2 rounded transition-all duration-150 focus:outline-none ${ 
                          loader ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900 active:bg-gray-700'
                        }`}
                    >
                        {loader ? "Loading..." : "Login"}
                    </button>

                    <p className="text-center text-slate-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </form>

            <Dialog open={isForgotPasswordModalOpen} onClose={handleCloseForgotPasswordModal} PaperProps={{ className: "rounded-xl p-6" }}>
                <DialogTitle className="font-bold text-gray-800 border-b pb-4 mb-4 text-xl">
                    {forgotPasswordStep === 'requestToken' && 'Request Password Reset'}
                    {forgotPasswordStep === 'resetPassword' && 'Reset Password'}
                    {forgotPasswordStep === 'success' && 'Password Reset Successful'}
                    {forgotPasswordStep === 'error' && 'Error'}
                </DialogTitle>
                <DialogContent className="px-4 py-4 space-y-4">
                    {forgotPasswordStep === 'requestToken' && (
                        <form id="forgot-password-request-token-form" onSubmit={handleSubmitRequestToken(handleRequestToken)} className="space-y-4">
                            <Typography className="text-gray-700 text-sm mb-4 text-center">Enter your username and password reset key to receive a reset token.</Typography>
                            <InputField
                                label="Username"
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                register={registerRequestToken}
                                errors={errorsRequestToken}
                                validation={{ required: 'Username is required' }}
                            />
                            <InputField
                                label="Password Reset Key"
                                type="text"
                                id="reset_key"
                                placeholder="Enter your password reset key"
                                register={registerRequestToken}
                                errors={errorsRequestToken}
                                validation={{ required: 'Password Reset Key is required', minLength: { value: 6, message: 'Password Reset Key must be at least 6 characters' } }}
                            />
                            {forgotPasswordError && <Typography color="error" className="text-sm text-center mt-4">{forgotPasswordError}</Typography>}
                        </form>
                    )}

                    {forgotPasswordStep === 'resetPassword' && (
                        <form id="forgot-password-reset-form" onSubmit={handleSubmitResetPassword(handleResetPassword)} className="space-y-4">
                            <Typography className="text-gray-700 text-sm mb-4">Enter your new password.</Typography>
                            <InputField
                                label="New Password"
                                type="password"
                                id="new_password"
                                placeholder="Enter your new password"
                                register={registerResetPassword}
                                errors={errorsResetPassword}
                                validation={{ required: 'New Password is required', minLength: { value: 6, message: 'New password must be at least 6 characters' } }}
                            />
                            {forgotPasswordError && <Typography color="error" className="text-sm text-center mt-4">{forgotPasswordError}</Typography>}
                        </form>
                    )}

                    {forgotPasswordStep === 'success' && (
                        <div className="space-y-4 text-center">
                            <Typography className="text-green-600 font-semibold">Password reset successfully!</Typography>
                            <Typography className="text-gray-600">You can now log in with your new password.</Typography>
                        </div>
                    )}

                    {forgotPasswordStep === 'error' && (
                        <div className="space-y-4 text-center">
                            <Typography color="error" className="font-semibold">Error:</Typography>
                            <Typography color="error">{forgotPasswordError || 'An unexpected error occurred.'}</Typography>
                        </div>
                    )}
                </DialogContent>
<DialogActions className="justify-center p-4 border-t">
  {forgotPasswordStep === 'requestToken' && (
    <>
      <Button
        onClick={handleCloseForgotPasswordModal}
        className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="forgot-password-request-token-form"
        disabled={loader}
        className={`bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 px-4 py-2 rounded transition-all duration-150 text-sm focus:outline-none ${ 
            loader ? 'bg-gray-700 cursor-not-allowed' : ''
          }`}
          
          
          
      >
        {loader ? <CircularProgress size={20} color="inherit" /> : 'Request Token'}
      </Button>
    </>
  )}

  {forgotPasswordStep === 'resetPassword' && (
    <>
      <Button
        onClick={handleCloseForgotPasswordModal}
        className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm"
      >
        Cancel
      </Button>
      <Button
  type="submit"
  form="forgot-password-reset-form"
  disabled={loader}
  className={`bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 px-4 py-2 rounded transition-all duration-150 text-sm focus:outline-none opacity-100 ${ 
    loader ? 'bg-gray-700 cursor-not-allowed' : ''
  }`}
>
  {loader ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
</Button>



    </>
  )}

  {(forgotPasswordStep === 'success' || forgotPasswordStep === 'error') && (
    <Button
      onClick={handleCloseForgotPasswordModal}
      className={`text-white px-4 py-2 rounded transition-all duration-150 text-sm focus:outline-none ${forgotPasswordStep === 'success' ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'}`}
    >
      Close
    </Button>
  )}
</DialogActions>

            </Dialog>
        </div>
    );
};

export default LogIn;