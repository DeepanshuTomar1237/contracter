import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Employment Contract Generator</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Contract</CardTitle>
            <CardDescription>Create a new employment contract by filling in employee details</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/generate">
              <Button className="w-full">Create New Contract</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Templates</CardTitle>
            <CardDescription>Edit your contract templates and clauses</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/templates">
              <Button className="w-full" variant="outline">
                Manage Templates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
