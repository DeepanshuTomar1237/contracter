"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTemplates, saveTemplate } from "@/lib/template-service"
import { ClauseEditor } from "@/components/clause-editor"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [activeTemplate, setActiveTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates()
        setTemplates(data)
        if (data.length > 0) {
          setActiveTemplate(data[0])
        }
      } catch (error) {
        console.error("Failed to load templates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const handleSaveTemplate = async () => {
    if (!activeTemplate) return

    setSaving(true)
    try {
      await saveTemplate(activeTemplate)
      // Update templates list
      const updatedTemplates = templates.map((t) => (t.id === activeTemplate.id ? activeTemplate : t))
      setTemplates(updatedTemplates)
    } catch (error) {
      console.error("Failed to save template:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-10">Loading templates...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Manage Contract Templates</h1>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="clauses">Clauses Library</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Select a template to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {templates.map((template: any) => (
                      <Button
                        key={template.id}
                        variant={activeTemplate?.id === template.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                    <Button variant="ghost" className="w-full mt-4">
                      + Add New Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {activeTemplate ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Template: {activeTemplate.name}</CardTitle>
                    <CardDescription>Modify the template structure and content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={activeTemplate.name}
                        onChange={(e) =>
                          setActiveTemplate({
                            ...activeTemplate,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Template Structure</Label>
                      <ClauseEditor
                        clauses={activeTemplate.clauses}
                        onChange={(clauses) =>
                          setActiveTemplate({
                            ...activeTemplate,
                            clauses,
                          })
                        }
                      />
                    </div>

                    <Button onClick={handleSaveTemplate} disabled={saving}>
                      {saving ? "Saving..." : "Save Template"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Select a template to edit</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clauses">
          <Card>
            <CardHeader>
              <CardTitle>Clauses Library</CardTitle>
              <CardDescription>Manage reusable contract clauses</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Clause library management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
