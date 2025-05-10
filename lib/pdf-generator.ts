import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"

export async function generatePdf(data: any): Promise<Blob> {
  try {
    // Get the template
    const template = await getTemplate(data.templateId)
    if (!template) {
      throw new Error("Template not found")
    }

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Add header
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(
      `LETTER OF APPOINTMENT FOR POSITION OF ${data.position.toUpperCase()}`,
      doc.internal.pageSize.width / 2,
      20,
      {
        align: "center",
      },
    )

    doc.setFontSize(12)
    doc.text("PRIVATE AND CONFIDENTIAL", doc.internal.pageSize.width / 2, 30, { align: "center" })

    // Add date
    doc.setFont("helvetica", "normal")
    const formattedDate = format(new Date(data.startDate), "dd/MM/yyyy")
    doc.text(`DATE: ${formattedDate}`, 20, 45)

    // Add salutation
    doc.text(`Dear ${data.employeeName},`, 20, 60)

    // Add clauses
    let y = 75
    template.clauses.forEach((clause: any, index: number) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      // Add clause title
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${clause.title}`, 20, y)
      y += 10

      // Add clause content if it exists
      if (clause.content) {
        // Process clause content with dynamic fields
        const content = processContent(clause.content, data)

        // Add clause content
        doc.setFont("helvetica", "normal")
        const contentLines = doc.splitTextToSize(content, 170)
        doc.text(contentLines, 20, y)
        y += contentLines.length * 7
      }

      // Add subclauses
      if (clause.subclauses && clause.subclauses.length > 0) {
        clause.subclauses.forEach((subclause: any, subIndex: number) => {
          // Check if we need a new page
          if (y > 270) {
            doc.addPage()
            y = 20
          }

          // Format the subclause number (e.g., "1.1.")
          const subclauseNumber = `${index + 1}.${subIndex + 1}.`

          // Add subclause number and title
          doc.setFont("helvetica", "bold")
          let subclauseText = subclauseNumber
          if (subclause.title) {
            subclauseText += ` ${subclause.title}`
          }
          doc.text(subclauseText, 25, y)
          y += 7

          // Process subclause content with dynamic fields
          const subcontent = processContent(subclause.content, data)

          // Add subclause content
          doc.setFont("helvetica", "normal")
          const subcontentLines = doc.splitTextToSize(subcontent, 165)
          doc.text(subcontentLines, 25, y)
          y += subcontentLines.length * 7 + 3
        })
      }

      y += 5 // Add some space between clauses
    })

    // Add signature section
    if (y > 240) {
      doc.addPage()
      y = 30
    } else {
      y += 20
    }

    doc.text("For and on behalf of the Company", 20, y)
    y += 25
    doc.line(20, y, 80, y)
    y += 5
    doc.text("Authorized Signatory", 20, y)

    y += 15
    doc.text("I have read and understood the terms and conditions of my employment.", 20, y)
    y += 25
    doc.line(20, y, 80, y)
    y += 5
    doc.text(`${data.employeeName}`, 20, y)

    return doc.output("blob")
  } catch (error) {
    console.error("PDF generation error:", error)
    throw error
  }
}

// Helper function to process content and replace placeholders
function processContent(content: string, data: any): string {
  return content
    .replace(/{{employeeName}}/g, data.employeeName)
    .replace(/{{position}}/g, data.position)
    .replace(/{{startDate}}/g, format(new Date(data.startDate), "dd/MM/yyyy"))
    .replace(/{{location}}/g, data.location)
    .replace(/{{probationPeriod}}/g, data.probationPeriod)
    .replace(/{{salary}}/g, data.salary || "")
}

// Get template function
async function getTemplate(templateId: string) {
  // In a real app, this would fetch from your API or database
  // For now, we'll use the template service
  const { getTemplate } = await import("./template-service")
  return getTemplate(templateId)
}
