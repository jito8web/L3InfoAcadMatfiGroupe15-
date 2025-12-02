import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function Table({ data }) {
    const [page, setPage] = useState(1)
    const perPage = 12
    const totalPages = Math.max(1, Math.ceil((data?.length || 0) / perPage))
    const pageData = data.slice((page - 1) * perPage, page * perPage)

    // ********************* Exportation des données *************************

    const exportCSV = () => {
        const sched = data
        const sch = []

        sched.forEach((r) => {
            sch.push({
                "Periode": r.period,
                "Amortissement": r.principal,
                "Intérêts": r.interest,
                "Annuité": r.payment,
                "Restant": r.remaining
            })
        })

        const csv = Papa.unparse(sch)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, 'amortissement.csv')
    }

    const exportXLSX = () => {
        const sched = data
        const sch = []

        sched.forEach((r) => {
            sch.push({
                "Periode": r.period,
                "Amortissement": r.principal,
                "Intérêts": r.interest,
                "Annuité": r.payment,
                "Restant": r.remaining
            })
        })

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(sch)
        XLSX.utils.book_append_sheet(wb, ws, 'Amortissement')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'amortissement.xlsx'
        )
    }

    const exportPDF = () => {
        const sched = data

        const doc = new jsPDF()

        doc.text("Tableau d'amortissement", 14, 16)

        const rows = sched.map(r => [
            r.period,
            r.principal,
            r.interest,
            r.payment,
            r.remaining,
        ])

        autoTable(doc, {
            head: [["Période", "Amortissement", "Intérêts", "Annuité", "Restant"]],
            body: rows,
            startY: 20,
        })

        doc.save("amortissement.pdf")
    }


    // **********************************************************
    return (
        <div className="mt-4 bg-white p-3 rounded shadow">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Période</th>
                            <th className="p-2">Amortissement</th>
                            <th className="p-2">Intérêts</th>
                            <th className="p-2">Annuité</th>
                            <th className="p-2">Restant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map(r => (
                            <tr key={r.period} className="border-b">
                                <td className="p-2 text-center">{r.period}</td>
                                <td className="p-2 text-center">{r.principal}</td>
                                <td className="p-2 text-center">{r.interest}</td>
                                <td className="p-2 text-center">{r.payment}</td>
                                <td className="p-2 text-center">{r.remaining}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-3 flex justify-between items-center">
                <div>Page {page} / {totalPages}</div>
                <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded">Précedent</button>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded">Suivant</button>
                </div>
            </div>
            <div className="mt-5 flex gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={exportCSV}>
                    Exporter En  CSV
                </button>
                <button className="bg-amber-600 text-white px-4 py-2 rounded" onClick={exportXLSX}>
                    Exporter En Excel
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={exportPDF}>
                    Exporter En PDF
                </button>
            </div>
        </div>
    )
}