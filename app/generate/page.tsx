"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { generatePdf } from "@/lib/pdf-generator"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function GenerateContract() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeName: "",
    position: "",
    startDate: new Date(),
    location: "Ahmedabad, Gujarat",
    salary: "",
    probationPeriod: "3",
    templateId: "default",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const pdfBlob = await generatePdf(formData)

      // Create a download link
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.employeeName.replace(/\s+/g, "_")}_contract.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Cleanup
      URL.revokeObjectURL(url)

      toast({
        title: "Success!",
        description: "Contract PDF has been generated and downloaded.",
      })

      // Optionally save to database
      // await saveContractRecord(formData)

      // Reset form or redirect
      // router.push('/contracts')
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Employment Contract</CardTitle>
          <CardDescription>Fill in the employee details to generate a contract</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => handleChange("employeeName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker date={formData.startDate} setDate={(date) => handleChange("startDate", date)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probationPeriod">Probation Period (months)</Label>
                <Select
                  value={formData.probationPeriod}
                  onValueChange={(value) => handleChange("probationPeriod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="2">2 months</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateId">Contract Template</Label>
              <Select value={formData.templateId} onValueChange={(value) => handleChange("templateId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Standard Employment Contract</SelectItem>
                  <SelectItem value="executive">Executive Contract</SelectItem>
                  <SelectItem value="contractor">Contractor Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Contract PDF"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
