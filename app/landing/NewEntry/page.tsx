import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";

const diseaseList = [
  { name: "Diabetes", image: "https://th.bing.com/th/id/OIP.zebRpAIqbDv0MS43zo7ZbQHaE8?rs=1&pid=ImgDetMain" },
  { name: "Heart Disease", image: "https://th.bing.com/th/id/OIP.nC4T8cgHtNzd-GD6EHORKwHaFj?rs=1&pid=ImgDetMain" },
  { name: "Kidney", image: "https://th.bing.com/th/id/OIP.qMAmqlGeoNvhHP4Iu-ueQAHaE8?rs=1&pid=ImgDetMain" },
  { name: "Liver", image: "https://static.vecteezy.com/system/resources/thumbnails/002/803/153/small_2x/illustration-of-healthcare-and-medical-education-drawing-chart-of-human-kidney-for-science-biology-study-vector.jpg" },
];
const DiseaseList = [
  { name: "Diabetes", link: "/landing/form" },
  { name: "Heart", link: "" },
  { name: "Kidney", link: "" },
  { name: "Liver", link: "" }];

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
            <Card className="p-4 shadow-md bg-white rounded-xl" onClick={redirect(disease.link)}>
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
