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
import SparklesText from "../ui/sparkles-text";
import WordPullUp from "../ui/word-pull-up";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

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
    <section id="features" className="pb-24 px-6">
      <SparklesText
        text="Powerful AI Features"
        className="text-3xl font-medium sm:text-4xl md:text-5xl text-center mb-12"
      />

      <div className="mb-16 px-16">
        <WordPullUp
          words="Image Editing Tools"
          className="text-2xl font-bold mb-8 text-left"
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 auto-cols-fr">
          {imageFeatures.map((feature, index) => (
            <CardContainer key={index} containerClassName="py-0 gap-4">
              <CardBody className="relative group/card bg-gradient-to-br from-secondary to-secondary-dark h-auto rounded-xl p-6 border hover:shadow-lg hover:shadow-blue-500/[0.2] transition-shadow duration-300">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  <feature.icon className="w-10 h-10 mb-2" />
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-3 dark:text-neutral-300"
                >
                  <CardTitle>{feature.title}</CardTitle>
                </CardItem>

                <CardItem translateZ="100" className="w-full mt-1">
                  <CardDescription>{feature.description}</CardDescription>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>

      <div className="px-16">
        <WordPullUp
          words="Video Editing Tools"
          className="text-2xl font-bold mb-8 text-left"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videoFeatures.map((feature, index) => (
            <CardContainer key={index} containerClassName="py-0 gap-4">
              <CardBody className="relative group/card bg-gradient-to-br from-secondary to-secondary-dark h-auto rounded-xl p-6 border hover:shadow-lg hover:shadow-blue-500/[0.2] transition-shadow duration-300">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  <feature.icon className="w-10 h-10 mb-2" />
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-3 dark:text-neutral-300"
                >
                  <CardTitle>{feature.title}</CardTitle>
                </CardItem>

                <CardItem translateZ="100" className="w-full mt-1">
                  <CardDescription>{feature.description}</CardDescription>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
