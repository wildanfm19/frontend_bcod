import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";

const Contact = () => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen py-12 bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
        >
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
                <p className="text-gray-600 text-center mb-6">
                    Berikut informasi kontak kami. Silakan hubungi kami untuk pertanyaan atau kerja sama.
                </p>

                <div className="text-center">
                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center">
                            <FaPhone className="text-blue-500 mr-2" />
                            <span className="text-gray-600">081210753730</span>
                        </div>

                        <div className="flex items-center">
                            <FaEnvelope className="text-blue-500 mr-2" />
                            <span className="text-gray-600">dracko.maaruftm@gmail.com</span>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <FaMapMarkedAlt className="text-blue-500 mb-1 text-xl" />
                            <span className="text-gray-600">
                                Jl. Kebon Jeruk Raya No.27, Kemanggisan, Palmerah, Jakarta Barat
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
