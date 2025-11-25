import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EducationalContent as EduContent } from "@/data";
import { educationalContentApi } from "@/lib/api";

const EducationalContent = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState<EduContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allContent = await educationalContentApi.getAll();
        setContent(allContent);
      } catch (err) {
        console.error('Failed to load educational content:', err);
        setError('Failed to load educational content');
        setContent([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const filteredContent = topic === "all" || !topic ? content : content.filter(article => article.topic === topic);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Error Loading Content</CardTitle>
            <CardDescription className="text-gray-300">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Educational Content</h1>
        
        <div className="mb-6">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-48 bg-black/20 backdrop-blur-lg border border-white/10 text-white">
              <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="Recycling">Recycling</SelectItem>
              <SelectItem value="Organic">Organic</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredContent.length === 0 ? (
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-gray-300">No educational content available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContent.map((article) => (
              <Card key={article.content_id} className="bg-black/20 backdrop-blur-lg border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">{article.title}</CardTitle>
                  <CardDescription className="text-gray-300">Topic: {article.topic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    {article.content_body.length > 150 
                      ? `${article.content_body.substring(0, 150)}...` 
                      : article.content_body}
                  </p>
                  <Button className="mt-2 bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white" variant="outline">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalContent;