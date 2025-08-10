import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Calendar, DollarSign } from "lucide-react";
import { Asset } from "@shared/schema";
import { format } from "date-fns";

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { data: assets, isLoading } = useQuery<Asset[]>({
    queryKey: ["api", "assets"],
  });

  const filteredAssets = assets?.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || asset.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(assets?.map(asset => asset.category) || []));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Asset Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Asset Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {assets?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Assets</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {assets?.filter(asset => asset.status === "active").length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Assets</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${((assets?.filter(asset => asset.currentValue).reduce((sum, asset) => sum + parseFloat(asset.currentValue || "0"), 0) || 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("")}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Cards */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No assets found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Asset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-gray-600">{asset.description}</p>
                  </div>
                  <Badge variant="outline">
                    {asset.category}
                  </Badge>
                </div>
                
                <div className="mt-4 space-y-2">
                  {asset.serialNumber && (
                    <div className="text-sm text-gray-600">
                      <span>SN: {asset.serialNumber}</span>
                    </div>
                  )}
                  {asset.purchaseDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Purchased: {format(new Date(asset.purchaseDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Value: ${asset.currentValue || asset.purchaseValue}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Location: {asset.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                      {asset.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}