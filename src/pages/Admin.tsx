import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Map, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminContentsTab } from "@/components/admin/AdminContentsTab";
import { AdminTracksTab } from "@/components/admin/AdminTracksTab";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Shield size={20} className="text-destructive" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">
            Painel Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerenciar conteúdos e trilhas de estudo
          </p>
        </div>
      </div>

      <Tabs defaultValue="contents" className="w-full">
        <TabsList>
          <TabsTrigger value="contents" className="flex items-center gap-1.5">
            <Video size={14} />
            Conteúdos
          </TabsTrigger>
          <TabsTrigger value="tracks" className="flex items-center gap-1.5">
            <Map size={14} />
            Trilhas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contents" className="mt-4">
          <AdminContentsTab />
        </TabsContent>
        <TabsContent value="tracks" className="mt-4">
          <AdminTracksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
