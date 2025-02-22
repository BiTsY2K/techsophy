import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

const diseaseList = [
  { name: "Diabetes", image: "https://th.bing.com/th/id/OIP.zebRpAIqbDv0MS43zo7ZbQHaE8?rs=1&pid=ImgDetMain" },
  { name: "Heart Disease", image: "https://th.bing.com/th/id/OIP.nC4T8cgHtNzd-GD6EHORKwHaFj?rs=1&pid=ImgDetMain" },
  { name: "Kidney", image: "https://th.bing.com/th/id/OIP.qMAmqlGeoNvhHP4Iu-ueQAHaE8?rs=1&pid=ImgDetMain" },
  { name: "Liver", image: "https://static.vecteezy.com/system/resources/thumbnails/002/803/153/small_2x/illustration-of-healthcare-and-medical-education-drawing-chart-of-human-kidney-for-science-biology-study-vector.jpg" },
];
const DiseaseList = [];

export default function HomeLayout() {
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
        <div className="grid mx-auto justify-center grid-cols-2 md:grid-cols-2 gap-6 mt-6">

          <Link href="/landing/NewEntry">
            <Card className="p-4 shadow-md bg-white rounded-xl">
              <h3 className="mt-4 font-semibold text-lg">New Record</h3>
              {/* <Button className="mt-4 px-4 py-2">Read more</Button> */}
            </Card>
          </Link>
          <Link href="/landing/PastDetails">
            <Card className="p-4 shadow-md bg-white rounded-xl" >
              <h3 className="mt-4 font-semibold text-lg">Past Record</h3>
              {/* <Button className="mt-4 px-4 py-2">Read more</Button> */}
            </Card>
          </Link>
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

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Hospitals</h2>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {["shah", "paradise", "chutnevs", "prego", "bawarchi", "ab's"].map((place) => (
            <li key={place} className="flex gap-4 p-4 bg-white shadow-md rounded-xl">
              <Image src={`/${place}.jpg`} width={100} height={100} alt={place} className="rounded-lg" />
              <div>
                <strong className="text-lg font-semibold capitalize">{place.replace("-", " ")}</strong>
                <p className="text-sm text-gray-600">A must-visit spot for delicious food.</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
