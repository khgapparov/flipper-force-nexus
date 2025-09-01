import { Building2, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              <span className="font-bold text-xl">FlipperForce</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              The complete platform for professional property flippers. 
              Streamline your operations and maximize your profits.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Features</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Mobile App</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@flipperforce.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-FLIPPER</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 FlipperForce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer