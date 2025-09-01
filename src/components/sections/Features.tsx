import { Card } from "@/components/ui/card"
import { 
  Camera, 
  DollarSign, 
  Users, 
  BarChart3, 
  Smartphone, 
  Clock,
  MapPin,
  FileText,
  Shield
} from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: Camera,
      title: "Real-Time Photo Documentation",
      description: "Capture and organize project photos instantly with GPS tagging and automatic categorization.",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      title: "Financial Tracking",
      description: "Track expenses, profits, and ROI in real-time with automated reporting and budget alerts.",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Coordinate with contractors, investors, and team members with role-based access control.",
      color: "text-secondary"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get insights into project performance, profit margins, and timeline optimization.",
      color: "text-primary"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Work seamlessly from the field with our responsive mobile interface and offline capabilities.",
      color: "text-secondary"
    },
    {
      icon: Clock,
      title: "Timeline Management",
      description: "Track project milestones, deadlines, and dependencies with automated scheduling.",
      color: "text-success"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Market analysis, comparable sales data, and neighborhood insights for better decisions.",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Store contracts, permits, invoices, and receipts in one secure, searchable location.",
      color: "text-secondary"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-level security with automated backups and compliance with industry standards.",
      color: "text-success"
    }
  ]

  return (
    <section className="py-24 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to 
            <span className="block text-primary">Flip Successfully</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From acquisition to sale, FlipperForce provides all the tools professional 
            property flippers need to maximize profits and minimize headaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-smooth group cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-bounce">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features