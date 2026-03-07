import Navbar from '../components/navbar';
import {Hero} from './components/Hero';
import HowItWork from '../components/how-it-works';
import Footer from '../components/footer';
export default function Page () {
    return (
       <div>
            <Navbar />
            <Hero />
            <HowItWork />
            <Footer />
        </div>
    )

}