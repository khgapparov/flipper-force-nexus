import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { galleryApi } from "@/lib/api";

const Updates = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [category, setCategory] = useState("PROGRESS");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !propertyId) {
      alert("Please select a property and a file.");
      return;
    }

    try {
      await galleryApi.uploadImage(propertyId, category, updateText, selectedFile);
      alert("Update posted successfully!");
      setSelectedFile(null);
      setUpdateText("");
    } catch (error) {
      console.error("Failed to post update:", error);
      alert("Failed to post update.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <label htmlFor="property-select">Property</label>
              <Select onValueChange={setPropertyId} value={propertyId}>
                <SelectTrigger id="property-select">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prop_12345">Property 1</SelectItem>
                  <SelectItem value="prop_67890">Property 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="category-select">Category</label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEFORE">Before</SelectItem>
                  <SelectItem value="AFTER">After</SelectItem>
                  <SelectItem value="PROGRESS">Progress</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="RECEIPT">Receipt</SelectItem>
                  <SelectItem value="UNCATEGORIZED">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="update-text">Update Description</label>
              <Textarea
                id="update-text"
                value={updateText}
                onChange={handleTextChange}
                placeholder="Describe the update..."
              />
            </div>
            <div>
              <label htmlFor="photo-upload">Upload Photo</label>
              <Input id="photo-upload" type="file" onChange={handleFileChange} />
            </div>
            <Button onClick={handleSubmit}>Post Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Updates;
