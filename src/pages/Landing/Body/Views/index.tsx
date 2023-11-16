import BlogsSection from "./Blogs";
import FAQSection from "./FAQS";
import FeaturesSection from "./Features";
import HeroSection from "./Hero";
import HowItWorksSection from "./HowItWorks";
import WhyBuyOurProductSection from "./WhyBuyOurProducts";

const LandingPageBody = () => {
    return (
        <>
        <main className="mx-auto sm:px-6 md:max-w-7xl max-w-7xl px-4">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <WhyBuyOurProductSection />
            <FAQSection />
            <BlogsSection />
        </main>
        </>
    )
}

export default LandingPageBody