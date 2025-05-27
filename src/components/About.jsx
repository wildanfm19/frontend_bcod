import { aboutUsImage } from "../utils/constant";

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-slate-800 text-4xl font-extrabold text-center mb-12 underline underline-offset-4">
                About Us
            </h1>

            <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Text Section */}
                <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in">
                    <div className="text-slate-700 leading-relaxed text-lg tracking-wide font-medium font-montserrat space-y-6">
                        <p>
                            <strong>B-COD</strong> adalah platform e-commerce khusus yang menyediakan kebutuhan belanja bagi para <strong>Binusian</strong> melalui sistem <strong>Cash on Delivery (COD)</strong>. Kami menyadari bahwa keamanan adalah hal yang paling utama, oleh karena itu, kami tidak hanya menawarkan tempat jual beli, tetapi juga membangun ekosistem belanja yang bertanggung jawab.
                        </p>

                        <p>
                            Dalam setiap transaksi COD, kami menjunjung tinggi <strong>kepercayaan</strong> dan <strong>integritas</strong>. Kami percaya bahwa pengalaman belanja yang aman adalah fondasi dari komunitas yang solid.
                        </p>

                        <p>
                            Kami juga memahami bahwa Binusian ingin berbelanja dengan <strong>mudah</strong>, <strong>fleksibel dalam pembayaran</strong>, dan <strong>tanpa ribet</strong>. Di B-COD, Anda cukup membayar secara tunai saat barang diterima di tangan Anda — simple dan aman!
                        </p>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                    <img
                        src={aboutUsImage}
                        alt="About Us"
                        className="w-full h-auto rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
