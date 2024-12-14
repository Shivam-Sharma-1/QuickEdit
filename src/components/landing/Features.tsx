import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ImageIcon,
  VideoIcon,
  Eraser,
  Wand2,
  Scissors,
  Download,
  FileText,
  Crop,
} from "lucide-react";

const imageFeatures = [
  {
    icon: Eraser,
    title: "Background Removal",
    description: "Remove backgrounds with AI precision",
  },
  {
    icon: Wand2,
    title: "AI Object Removal",
    description: "Magically remove unwanted objects",
  },
  {
    icon: ImageIcon,
    title: "AI Background Replace",
    description: "Replace backgrounds seamlessly",
  },
  {
    icon: Scissors,
    title: "AI Object Extract",
    description: "Extract objects with ease",
  },
  {
    icon: Download,
    title: "Multi-size Export",
    description: "Export in various sizes",
  },
];

const videoFeatures = [
  {
    icon: FileText,
    title: "AI Video Transcription",
    description: "Accurate transcriptions powered by AI",
  },
  {
    icon: Crop,
    title: "Smart Video Crop",
    description: "Intelligently crop videos for any format",
  },
  {
    icon: Download,
    title: "Flexible Video Export",
    description: "Export videos in multiple sizes",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Powerful AI Features
      </h2>

      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8">Image Editing Tools</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imageFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-8">Video Editing Tools</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videoFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
