// This is a mock implementation - in a real app, you'd use a database or API
// to store and retrieve templates

// Mock data structure
type Clause = {
  id: string
  title: string
  content: string
  subclauses: Clause[]
}

type Template = {
  id: string
  name: string
  clauses: Clause[]
}

// Mock initial data
const mockTemplates: Template[] = [
  {
    id: "default",
    name: "Standard Employment Contract",
    clauses: [
      {
        id: "clause_1",
        title: "EMPLOYMENT CONTRACT AND PERIOD",
        content: "",
        subclauses: [
          {
            id: "clause_1_1",
            title: "",
            content:
              'We would like to take this opportunity to welcome you to the Company and confirm your employment with effect from {{startDate}} in the position of "{{position}}". This letter sets out the terms and conditions of your employment.',
            subclauses: [],
          },
          {
            id: "clause_1_2",
            title: "",
            content:
              "The Company may in its absolute discretion and from time to time require you to perform duties which may fall outside of your job title and/or job description.",
            subclauses: [],
          },
          {
            id: "clause_1_3",
            title: "",
            content:
              "Initially you will be located at {{location}}. Your services will be transferable to any of our current and future establishments in India or Global at the sole discretion of the Management.",
            subclauses: [],
          },
        ],
      },
      {
        id: "clause_2",
        title: "EFFECTIVE DATE",
        content: "",
        subclauses: [
          {
            id: "clause_2_1",
            title: "",
            content:
              "The effective date of this contract is the date of signature hereof, however should you have been employed by the Company prior to the effective date and continue to remain in the employ of the Company immediately preceding the effective date then the applicability of the time periods for calculation of your holiday leave, will be calculated in accordance with the date you commenced your employment with the Company in terms of clause 1.1. above.",
            subclauses: [],
          },
          {
            id: "clause_2_2",
            title: "",
            content:
              "For you first {{probationPeriod}} months of employment will be probation period. Based on your overall performance for this period you will be eligible to get confirmed employment.",
            subclauses: [],
          },
        ],
      },
      
      
    ],
  },
  {
    id: "executive",
    name: "Executive Contract",
    clauses: [
      {
        id: "exec_clause_1",
        title: "APPOINTMENT AND DUTIES",
        content: "",
        subclauses: [
          {
            id: "exec_clause_1_1",
            title: "",
            content: "The Company hereby appoints you as {{position}} effective {{startDate}}.",
            subclauses: [],
          },
        ],
      },
    ],
  },
]

// Store templates in localStorage to persist between page refreshes
const initializeTemplates = () => {
  if (typeof window !== "undefined") {
    const storedTemplates = localStorage.getItem("contractTemplates")
    if (!storedTemplates) {
      localStorage.setItem("contractTemplates", JSON.stringify(mockTemplates))
    }
  }
}

// Get all templates
export const getTemplates = async (): Promise<Template[]> => {
  initializeTemplates()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (typeof window !== "undefined") {
    const storedTemplates = localStorage.getItem("contractTemplates")
    return storedTemplates ? JSON.parse(storedTemplates) : mockTemplates
  }

  return mockTemplates
}

// Get a specific template
export const getTemplate = async (id: string): Promise<Template | null> => {
  const templates = await getTemplates()
  return templates.find((template) => template.id === id) || null
}

// Save a template
export const saveTemplate = async (template: Template): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (typeof window !== "undefined") {
    const templates = await getTemplates()
    const index = templates.findIndex((t) => t.id === template.id)

    if (index !== -1) {
      templates[index] = template
    } else {
      templates.push(template)
    }

    localStorage.setItem("contractTemplates", JSON.stringify(templates))
  }
}

// Delete a template
export const deleteTemplate = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (typeof window !== "undefined") {
    const templates = await getTemplates()
    const filteredTemplates = templates.filter((t) => t.id !== id)
    localStorage.setItem("contractTemplates", JSON.stringify(filteredTemplates))
  }
}
