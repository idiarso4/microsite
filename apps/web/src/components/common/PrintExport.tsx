import React from 'react'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box
} from '@mui/material'
import {
  Print,
  PictureAsPdf,
  TableChart,
  Description,
  Image,
  GetApp
} from '@mui/icons-material'

export interface PrintExportMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onPrint?: () => void
  onExportPDF?: () => void
  onExportExcel?: () => void
  onExportCSV?: () => void
  onExportImage?: () => void
  title?: string
  disabled?: boolean
}

export default function PrintExportMenu({
  anchorEl,
  open,
  onClose,
  onPrint,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onExportImage,
  title = 'Export Options',
  disabled = false
}: PrintExportMenuProps) {
  const handleAction = (action: (() => void) | undefined) => {
    if (action && !disabled) {
      action()
    }
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1
          }
        }
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Divider />

      {onPrint && (
        <MenuItem onClick={() => handleAction(onPrint)} disabled={disabled}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>
      )}

      {onExportPDF && (
        <MenuItem onClick={() => handleAction(onExportPDF)} disabled={disabled}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as PDF" />
        </MenuItem>
      )}

      {onExportExcel && (
        <MenuItem onClick={() => handleAction(onExportExcel)} disabled={disabled}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as Excel" />
        </MenuItem>
      )}

      {onExportCSV && (
        <MenuItem onClick={() => handleAction(onExportCSV)} disabled={disabled}>
          <ListItemIcon>
            <Description fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as CSV" />
        </MenuItem>
      )}

      {onExportImage && (
        <MenuItem onClick={() => handleAction(onExportImage)} disabled={disabled}>
          <ListItemIcon>
            <Image fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as Image" />
        </MenuItem>
      )}
    </Menu>
  )
}

// Print utilities
export class PrintUtils {
  static printTable(data: any[], columns: any[], title: string) {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1A1A1A; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => `<td>${row[col.id] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  static printElement(elementId: string, title: string) {
    const element = document.getElementById(elementId)
    if (!element) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1A1A1A; margin-bottom: 20px; }
            .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          ${element.innerHTML}
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }
}

// Export utilities
export class ExportUtils {
  static exportToCSV(data: any[], columns: any[], filename: string) {
    const headers = columns.map(col => col.label).join(',')
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.id] || ''
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value
      }).join(',')
    )

    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  static exportToJSON(data: any[], filename: string) {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  static async exportToExcel(data: any[], columns: any[], filename: string) {
    try {
      const XLSX = await import('xlsx')

      // Prepare data for Excel
      const excelData = data.map(row => {
        const excelRow: any = {}
        columns.forEach(col => {
          excelRow[col.label] = row[col.id] || ''
        })
        return excelRow
      })

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Auto-size columns
      const colWidths = columns.map(col => ({
        wch: Math.max(col.label.length, 15)
      }))
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data')

      // Save file
      XLSX.writeFile(wb, `${filename}.xlsx`)
    } catch (error) {
      console.error('Failed to export to Excel:', error)
      // Fallback to CSV
      this.exportToCSV(data, columns, filename)
    }
  }

  static async exportToPDF(data: any[], columns: any[], title: string, filename: string) {
    try {
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 14, 20)

      // Add generation date
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)

      // Prepare table data
      const headers = columns.map(col => col.label)
      const rows = data.map(row =>
        columns.map(col => {
          const value = row[col.id]
          // Convert complex values to strings
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value)
          }
          return value?.toString() || ''
        })
      )

      // Add table
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [220, 20, 60], // Crimson color
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 40, right: 14, bottom: 20, left: 14 }
      })

      // Save PDF
      doc.save(`${filename}.pdf`)
    } catch (error) {
      console.error('Failed to export to PDF:', error)
      // Fallback to print
      PrintUtils.printTable(data, columns, title)
    }
  }
}
