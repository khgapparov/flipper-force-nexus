import { Button } from "@/components/ui/enhanced-button"
import { ArrowRight, CheckCircle } from "lucide-react"

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform
            <span className="block">Your Flipping Business?</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Join thousands of successful property flippers who've increased their profits 
            and streamlined their operations with FlipperForce.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button variant="hero" size="hero" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="hero" 
              className="border-white/30 text-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-white/90">30-day free trial</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-white/90">No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-white/90">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA