import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const diseaseList = [
  { name: "Diabetes", image: "https://th.bing.com/th/id/OIP.zebRpAIqbDv0MS43zo7ZbQHaE8?rs=1&pid=ImgDetMain" },
  { name: "Heart Disease", image: "https://th.bing.com/th/id/OIP.nC4T8cgHtNzd-GD6EHORKwHaFj?rs=1&pid=ImgDetMain" },
  { name: "Cancer", image: "https://th.bing.com/th/id/OIP.NinbneS2x1Teyts6N4QDzAHaEc?rs=1&pid=ImgDetMain" },
  { name: "Alzheimers", image: "https://th.bing.com/th/id/OIP.dxjoXx9-UuH7LPEAGgdvfQHaE8?w=303&h=202&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
];
const DiseaseList = [
  { name: "Diabetes" },
  { name: "Heart" },
  { name: "Kidney" },
  { name: "Liver" }];

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="text-center py-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold">AI for Diagnosis & Symptoms Checking</h1>
      </header>

      <div className="flex justify-center my-6">
        <Image src="https://dz2cdn1.dzone.com/storage/temp/15489904-medical-datasets.jpg" width={800} height={400} alt="Food Offer Banner" className="rounded-lg" />
      </div>

      <section className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Diseases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {DiseaseList.map((disease) => (
            <Card className="p-4 shadow-md bg-white rounded-xl">
              <h3 className="mt-4 font-semibold text-lg">{disease.name}</h3>
              {/* <Button className="mt-4 px-4 py-2">Read more</Button> */}
            </Card>
          ))}

        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Diseases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {diseaseList.map((disease, idx) => (
            <Card key={idx} className="p-4 shadow-md bg-white rounded-xl">
              <Image src={`${disease.image}`} width={150} height={150} alt={disease.name} className="mx-auto" />
              <h3 className="mt-4 font-semibold text-lg">{disease.name.charAt(0).toUpperCase() + disease.name.slice(1)}</h3>
              <Button className="mt-4 px-4 py-2">Read more</Button>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
