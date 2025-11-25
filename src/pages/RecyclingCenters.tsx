import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

const RecyclingCenters = () => {
  const [search, setSearch] = useState("");

  const centers = [
    { name: "Central Recycling Center", address: "123 Main St", materials: "Plastic, Paper, Glass" },
    { name: "East Side Depot", address: "456 Elm St", materials: "Metal, Electronics" },
    { name: "West End Facility", address: "789 Oak St", materials: "Organic, Hazardous" },
  ];

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(search.toLowerCase()) ||
    center.materials.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Find Recycling Centers</h1>
        
        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Search by name or materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
          />
          <Button className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCenters.map((center, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5" />
                  {center.name}
                </CardTitle>
                <CardDescription className="text-gray-300">{center.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300"><strong>Materials Accepted:</strong> {center.materials}</p>
                <Button className="mt-2 bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white" variant="outline">View on Map</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecyclingCenters;