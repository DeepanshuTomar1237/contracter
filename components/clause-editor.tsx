"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react"

type Clause = {
  id: string
  title: string
  content: string
  subclauses: Clause[]
}

type ClauseEditorProps = {
  clauses: Clause[]
  onChange: (clauses: Clause[]) => void
}

export function ClauseEditor({ clauses = [], onChange }: ClauseEditorProps) {
  const generateId = () => `clause_${Date.now()}_${Math.floor(Math.random() * 1000)}`

  const addClause = () => {
    const newClause = {
      id: generateId(),
      title: "New Clause",
      content: "",
      subclauses: [],
    }
    onChange([...clauses, newClause])
  }

  const updateClause = (id: string, updates: Partial<Clause>) => {
    const updateClauseRecursive = (items: Clause[]): Clause[] => {
      return items.map((clause) => {
        if (clause.id === id) {
          return { ...clause, ...updates }
        }
        if (clause.subclauses.length > 0) {
          return {
            ...clause,
            subclauses: updateClauseRecursive(clause.subclauses),
          }
        }
        return clause
      })
    }

    onChange(updateClauseRecursive(clauses))
  }

  const addSubclause = (parentId: string) => {
    const addSubclauseRecursive = (items: Clause[]): Clause[] => {
      return items.map((clause) => {
        if (clause.id === parentId) {
          return {
            ...clause,
            subclauses: [
              ...clause.subclauses,
              {
                id: generateId(),
                title: "New Subclause",
                content: "",
                subclauses: [],
              },
            ],
          }
        }
        if (clause.subclauses.length > 0) {
          return {
            ...clause,
            subclauses: addSubclauseRecursive(clause.subclauses),
          }
        }
        return clause
      })
    }

    onChange(addSubclauseRecursive(clauses))
  }

  const removeClause = (id: string) => {
    const removeClauseRecursive = (items: Clause[]): Clause[] => {
      return items
        .filter((clause) => clause.id !== id)
        .map((clause) => {
          if (clause.subclauses.length > 0) {
            return {
              ...clause,
              subclauses: removeClauseRecursive(clause.subclauses),
            }
          }
          return clause
        })
    }

    onChange(removeClauseRecursive(clauses))
  }

  const moveClause = (id: string, direction: "up" | "down") => {
    const moveInArray = (array: Clause[], index: number, direction: "up" | "down"): Clause[] => {
      if ((direction === "up" && index === 0) || (direction === "down" && index === array.length - 1)) {
        return array
      }

      const newArray = [...array]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      const temp = newArray[index]
      newArray[index] = newArray[targetIndex]
      newArray[targetIndex] = temp

      return newArray
    }

    const moveClauseRecursive = (items: Clause[]): Clause[] => {
      const index = items.findIndex((clause) => clause.id === id)

      if (index !== -1) {
        return moveInArray(items, index, direction)
      }

      return items.map((clause) => {
        if (clause.subclauses.length > 0) {
          return {
            ...clause,
            subclauses: moveClauseRecursive(clause.subclauses),
          }
        }
        return clause
      })
    }

    onChange(moveClauseRecursive(clauses))
  }

  const renderClause = (clause: Clause, index: number, level = 0, parentArray: Clause[] = []) => {
    return (
      <Card key={clause.id} className={`mb-4 ${level > 0 ? "ml-6" : ""}`}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Label className="font-bold">{`${index + 1}.`}</Label>
              <Input
                value={clause.title}
                onChange={(e) => updateClause(clause.id, { title: e.target.value })}
                className="max-w-xs"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveClause(clause.id, "up")} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveClause(clause.id, "down")}
                disabled={index === parentArray.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => addSubclause(clause.id)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeClause(clause.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Textarea
            value={clause.content}
            onChange={(e) => updateClause(clause.id, { content: e.target.value })}
            placeholder="Enter clause content..."
            className="mb-2"
            rows={3}
          />

          {clause.subclauses.map((subclause, i) => renderClause(subclause, i, level + 1, clause.subclauses))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">{clauses.map((clause, i) => renderClause(clause, i, 0, clauses))}</div>

      <Button variant="outline" onClick={addClause} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Clause
      </Button>
    </div>
  )
}
